import Joi from 'joi';
import argon2 from 'argon2';
import { addMinutes } from 'date-fns';
import log from 'loglevel';
import fetch from 'node-fetch';
import * as TokenUtil from 'oauth2-server/lib/utils/token-util';
import { checkUserRateLimit } from './rate-limit.service';

const saveAuthorizationCode = () => {
  // TODO: 
};

class RateLimitError extends Error {
  data: {
    retryAfter: number;
  };
  constructor(message: string, data: { retryAfter: number }) {
    super(message);
    this.data = this.data;
  }
}

export async function createRandomAuthCode() {
  const authCode = await TokenUtil.generateRandomToken();
  const authCodeExpiresAt = addMinutes((new Date()), 5);

  return { authCode, expiresAt: authCodeExpiresAt };
}

export async function authenticate({ username, password, hash, email, ip }: {
  username?: string, password?: string, hash?: string, email: string, ip: string
}): Promise<{ code: string, expiresAt: Date } | null> {
  if (/*!username || */!hash || !password || !email || !ip) {
    return null;
  }
  const { onSuccess, onFailure, retryAfter } = await checkUserRateLimit(email, ip);

  if (!await argon2.verify(hash, password) || retryAfter) {
    if (retryAfter) {
      throw new RateLimitError('Rate limit reached.', { retryAfter });
    }
    await onFailure();
    return null;
  }
  await onSuccess();

  const { authCode, expiresAt } = await createRandomAuthCode();

  return { code: authCode, expiresAt };
}

const addressSchema = Joi.object({
  address: Joi.string()
    .alphanum()
    .case('lower')
    .pattern(/^(zs)|(ua)/)
    .min(10)
    .max(150)
    .required(),
});

const encryptMessage = async (
  address, payload: { code?: string, verificationToken?: string, expiryAt: Date } = { code: '123123123', expiryAt: addMinutes(new Date(), 5) }
) => {
  try {
    const value = await addressSchema.validateAsync({ address });
    if (!value.address || value.error) {
      return null;
    }
    log.debug('fetching');
    const res = await fetch(`http://zecwallet_api:8001/api/encryptmessage?address=${value.address}&memo=${JSON.stringify(payload)}`);
    log.debug({ res });
    const result = await res.json();

    const { message } = result as { message?: string } || {};

    if (!message) {
      return null;
    }

    return message;
  } catch (err) {
    log.error(err);
    return null;
  }
};

export const encodeZcashAddressCode = async (address) => {
  const { authCode, expiresAt } = await createRandomAuthCode();
  const message = await encryptMessage(address, { code: authCode, expiryAt: expiresAt });

  return message;
};

export const encodeZcashAddressValidationToken = async (address, token) => {
  const message = await encryptMessage(address, { verificationToken: token, expiryAt: addMinutes(new Date(), 30)});

  return message;
}



/**
 * https://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api
 * https://www.accountsjs.com/docs/server/#customising-the-jwt-payload
 * 
 * roles: ['system', 'admin', 'user']
 * 
 * 
 */
