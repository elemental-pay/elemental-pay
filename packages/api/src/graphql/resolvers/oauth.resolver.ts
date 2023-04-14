import { addMinutes } from 'date-fns';
import fetch from 'node-fetch';

import { GraphQLContext } from '../../app';
import { ElementalGraphQLError } from '../../errors';


const resolver = {
  Query: {
    checkAuthorizationGrant: async (_, { input }, context: GraphQLContext) => {
      const { clientId, scope, redirectUri } = input;
      const { token } = context;

      const { user, grant } = await context.oAuth2Client.getAuthorize(token, 'profile', '', process.env.OAUTH_API_CLIENT_ID, redirectUri);
      
      console.log('user, grant: ', JSON.stringify({ user, grant }));
      
      // type AuthorizationGrantResponse {
      //   client: OAuth2Client
      //   request: GrantRequest
      // }
      return {
          __typename: 'AuthorizationGrantResponse',
          client: grant.client,
          request: grant.request,
      }
      // throw new ElementalGraphQLError(JSON.stringify({ json }), 'ERROR');
    },
  },
  Mutation: {
    authorize: async (_, { input, confirm }, context: GraphQLContext) => {
      const { clientId, scope, redirectUri } = input;
      const { token } = context;

      const { code, redirectUri: _redirectUri } = await context.oAuth2Client.authorize(token, 'profile', process.env.OAUTH_API_CLIENT_ID, redirectUri, confirm);
      
      console.log('code, _redirectUri: ', JSON.stringify({ code, _redirectUri }));
      
      // type AuthorizationGrantResponse {
      //   client: OAuth2Client
      //   request: GrantRequest
      // }
      return {
          __typename: 'AuthorizationCode',
          code,
          redirectUri: _redirectUri,
          // client: grant.client,
          // request: grant.request,
      }
      // throw new ElementalGraphQLError(JSON.stringify({ json }), 'ERROR');
    },
  }
}

export default resolver;
