import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from '../data';


/**
 * 
 * key: user.id:ACTION_TYPE
 * value: { count, startTime }
 */

const maxWrongAttemptsByIPperDay = 100;

const maxConsecutiveFailsByUsernameAndIP = 10;

// TODO: Softfail and request CAPTCHA if IP is greylisted to work better for shared IP environments like CGNAT or a VPN
const limiterSlowBruteByIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});

const verificationEmailLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'verification_email_per_day',
  points: 5, // 5 attempts
  duration: 15 * 60, // within 15 minutes
});

const verificationEmailLimiterOutOfLimits = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'verification_email_consecutive_outoflimits',
  points: 99999, // doesn't matter much, this is just counter
  duration: 0, // never expire
});

const verificationZcashaddressLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'verification_zcashaddress_per_day',
  points: 5, // 5 attempts
  duration: 15 * 60, // within 15 minutes
});

const verificationZcashaddressLimiterOutOfLimits = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'verification_zcashaddress_consecutive_outoflimits',
  points: 99999, // doesn't matter much, this is just counter
  duration: 0, // never expire
});

function getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits) {
  if (countConsecutiveOutOfLimits <= 1) {
    return 1;
  }

  return getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits - 1) + getFibonacciBlockDurationMinutes(countConsecutiveOutOfLimits - 2);
}


const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'login_fail_consecutive_username_and_ip',
  points: maxConsecutiveFailsByUsernameAndIP,
  duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
  blockDuration: 60 * 60, // Block for 1 hour
});

const getUsernameIPkey = (username, ip) => `${username}_${ip}`;

export const checkUserRateLimit = async (email, ip): Promise<{
  retryAfter?: number, onSuccess?: () => void, onFailure?: () => void
}> => {
  const usernameIPkey = getUsernameIPkey(email, ip);

  const [resUsernameAndIP, resSlowByIP] = await Promise.all([
    limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
    limiterSlowBruteByIP.get(ip),
  ]);

  let retrySecs = 0;

  // Check if IP or Username + IP is already blocked
  if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
    retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
  }

  if (retrySecs > 0) {
    return { retryAfter: retrySecs };
    // res.set('Retry-After', String(retrySecs));
    // res.status(429).send('Too Many Requests');
  } else {
    return {
      onSuccess: async () => {
        if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
          // Reset on successful authorisation
          await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
        }
      },
      onFailure: async () => {
        try {
          const promises = [limiterSlowBruteByIP.consume(ip)];
          // if (userExists) { --- should only be called on user auth failure, so user will exist already
          promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));
          // }

          await Promise.all(promises);

          return null;
          // res.status(400).end('email or password is wrong');
        } catch (rlRejected) {
          if (rlRejected instanceof Error) {
            throw rlRejected;
          } else {
            return { retryAfter: Math.round(rlRejected.msBeforeNext / 1000) || 1 };
          }
        }
      }
    }
  };
};

export const checkEmailVerificationLimit = async (email): Promise<{ retryAfter?: number, allow?: boolean }> => {
  const resById = await verificationEmailLimiter.get(email);

  let retrySecs = 0;

  if (resById !== null && resById.remainingPoints <= 0) {
    retrySecs = Math.round(resById.msBeforeNext / 1000) || 1;
  }

  if (retrySecs > 0) {
    return { retryAfter: retrySecs }
  } else {
    try {
      const resConsume = await verificationEmailLimiter.consume(email);
      if (resConsume.remainingPoints <= 0) {
        const resPenalty = await verificationEmailLimiterOutOfLimits.penalty(email);
        await verificationEmailLimiter.block(email, 60 * getFibonacciBlockDurationMinutes(resPenalty.consumedPoints));
      }
    } catch (rlRejected) {

      if (rlRejected instanceof Error) {
        throw rlRejected;
      } else {
        // res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
        // res.status(429).send('Too Many Requests');
        return { retryAfter: Math.round(rlRejected.msBeforeNext / 1000) || 1 };
      }
    }
  }

  return { allow: true };
};

export const checkZcashaddressVerificationLimit = async (address): Promise<{ retryAfter?: number, allow?: boolean }> => {
  const resById = await verificationZcashaddressLimiter.get(address);

  let retrySecs = 0;

  if (resById !== null && resById.remainingPoints <= 0) {
    retrySecs = Math.round(resById.msBeforeNext / 1000) || 1;
  }

  if (retrySecs > 0) {
    return { retryAfter: retrySecs }
  } else {
    try {
      const resConsume = await verificationZcashaddressLimiter.consume(address);
      if (resConsume.remainingPoints <= 0) {
        const resPenalty = await verificationZcashaddressLimiterOutOfLimits.penalty(address);
        await verificationZcashaddressLimiter.block(address, 60 * getFibonacciBlockDurationMinutes(resPenalty.consumedPoints));
      }
    } catch (rlRejected) {

      if (rlRejected instanceof Error) {
        throw rlRejected;
      } else {
        // res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
        // res.status(429).send('Too Many Requests');
        return { retryAfter: Math.round(rlRejected.msBeforeNext / 1000) || 1 };
      }
    }
  }

  return { allow: true };
};

// TODO: Determine whether this is necessary? If email is verified, shouldn't really matter :)
// export const clearEmailVerificationLimit = async () => {};
