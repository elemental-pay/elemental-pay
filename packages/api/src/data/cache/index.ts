/**
 * Deprecated Cache router
 */

import { OAuthTokenType, UserType } from '../../models';
import { cacheDelete, cacheGet, cacheSet } from '../../utils';

export const users = {
  getById: async (userId): Promise<UserType> => {
    const cachedUser = await cacheGet(`users:${userId}`) as UserType;
    return cachedUser;
  },
  deleteById: async () => {},
  save: async (user): Promise<boolean> => {
    const { uuid } = user;
    if (uuid) {
      return await cacheSet(`users:${uuid}`, user);
    }
    return null;
  },
};

export const tokens = {
  getTokenByRefreshToken: async (refreshToken: string): Promise<OAuthTokenType> => {
    let accessToken = await cacheGet(`accessTokenByRefreshToken:${refreshToken}`);

    if (accessToken) {
      return await cacheGet(`tokens:${accessToken}`) as OAuthTokenType;
    }
    return null;
  },
  deleteByAccessToken: async (accessToken: string): Promise<boolean> => {
    const { refreshToken} = await tokens.getByAccessToken(accessToken);
    if (refreshToken) {
      await cacheDelete(`accessTokenByRefreshToken:${refreshToken}`);
    }
    return await Boolean(cacheDelete(`tokens:${accessToken}`));
  },
  getByAccessToken: async (accessToken: string): Promise<OAuthTokenType> => {
    const cachedToken = await cacheGet(`tokens:${accessToken}`) as OAuthTokenType;

    return cachedToken;
  },
  save: async (token): Promise<boolean> => {
    const { accessToken } = token;
    if (accessToken) {
      return await cacheSet(`tokens:${accessToken}`, token);
    }
    return null;
  },
};

