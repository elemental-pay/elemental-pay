import { ModelToSnakeCase, ModelToType } from '../utils';

import User from './user.model';
import { OAuthToken, OAuthClient, OAuthScope, OAuthAuthorizationCode } from './oauth';

export type UserTypeSQL = ModelToSnakeCase<User>;
export type UserType = ModelToType<User>;

export type OAuthTokenSQL = ModelToSnakeCase<OAuthToken>;
export type OAuthTokenType = ModelToType<OAuthToken>;

export type OAuthClientSQL = ModelToSnakeCase<OAuthClient>;
export type OAuthClientType = ModelToType<OAuthClient>;

export type OAuthScopeSQL = ModelToSnakeCase<OAuthScope>;
export type OAuthScopeType = ModelToType<OAuthScope>;

export type OAuthAuthorizationCodeSQL = ModelToSnakeCase<OAuthAuthorizationCode>;
export type OAuthAuthorizationCodeType = ModelToType<OAuthAuthorizationCode>;
