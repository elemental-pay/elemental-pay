import userSchema, { UserEntity} from './user.schema';
import oAuthClientSchema, { OAuthClientEntity } from './oauth-client.schema';
import oAuthScopeSchema, { OAuthScopeEntity} from './oauth-scope.schema';
import oAuthTokenSchema, { OAuthTokenEntity} from './oauth-token.schema';
import oAuthAuthorizationCodeSchema, { AuthorizationCodeEntity } from './oauth-authorization-code.schema';

export {
  UserEntity,
  OAuthClientEntity,
  OAuthScopeEntity,
  OAuthTokenEntity,
  AuthorizationCodeEntity,
};

export default function createRedisRepos(redisOmClient) {
  return {
    users: redisOmClient.fetchRepository(userSchema),
    clients: redisOmClient.fetchRepository(oAuthClientSchema),
    scopes: redisOmClient.fetchRepository(oAuthScopeSchema),
    tokens: redisOmClient.fetchRepository(oAuthTokenSchema),
    authorizationCodes: redisOmClient.fetchRepository(oAuthAuthorizationCodeSchema),
  };
};
