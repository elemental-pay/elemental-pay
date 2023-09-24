import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import bodyParser from 'body-parser';
import cors from 'cors';

import typeDefs from './graphql/types';
import resolvers from './graphql/resolvers';
import { APIWrapper, UsersAPI } from './data/api';
import { extractBearerToken } from './utils';
import { getUserFromAccessToken, oAuthClient } from './services/oauth.service';
import { AuthenticationError } from './errors';
import { UserType } from './models';



const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const guestApiWrapper = new APIWrapper(process.env.FLASK_API_URL);
const guestRepositories = { users: new UsersAPI(guestApiWrapper) }

class GuestViewer {
  isAuthenticated: boolean;
  roles: string[];
  permissions: string[];
  isSystem: boolean;

  constructor() {
    this.isAuthenticated = false;
    this.roles = ['guest'];
    this.permissions = ['read'];
    this.isSystem = false;
  }

  get id() {
    return null;
  }

  get name() {
    return null;
  }
}

type FormattedUserType = Omit<Partial<UserType>, 'id'> & {
  id: string,
};
class AuthenticatedViewer implements FormattedUserType {
  isAuthenticated: boolean;
  roles: string[];
  permissions: string[];
  isSystem: boolean;

  id: string;
  username: string;
  name: string;
  constructor(user) {
    this.isAuthenticated = true;

    this.id = user.uuid;
    this.username = user.login_id || user.username;
    this.isSystem = false;
    // this.roles = user.roles;
    // this.permissions = user.permissions;
  }
}

const injectAuthorizedApiWrapper = (repositories: { [key: string]: UsersAPI }, apiWrapper) => {
  Object.keys(repositories).forEach((repoName) => {
    const repo = repositories[repoName];
    repo.apiWrapper = apiWrapper;
  });
}

const getContextFromRequest = async (req) => {
    const apiWrapper = new APIWrapper(process.env.FLASK_API_URL);
    const context = {
      request: req,
      viewer: new GuestViewer(),
      flaskApi: apiWrapper,
      users: new UsersAPI(apiWrapper),
      oAuth2Client: oAuthClient,
      token: null,
    };
    const token = extractBearerToken(req.headers);
  
    if (token) {
      const userMeta = await getUserFromAccessToken(token);
      
      if (userMeta) {
        context.flaskApi = new APIWrapper(process.env.FLASK_API_URL, token);
        injectAuthorizedApiWrapper({ ...({ users: context.users }) }, context.flaskApi);
        const user = await context.users.findById(userMeta, userMeta.id);
  
        console.log(JSON.stringify({ user }));
        context.viewer = new AuthenticatedViewer(user);
        context.token = token;
        console.log(JSON.stringify({ 'context.viewer': context.viewer }))
      } else {
        throw new AuthenticationError('Invalid access token');
      }
    }
    // context.
  
    return context;
  };

export type GraphQLContext = Awaited<ReturnType<typeof getContextFromRequest>>;



export const makeApolloServer = async (app, httpServer) => {
  // Set up ApolloServer.
  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // // Proper shutdown for the WebSocket server.
      // {
      //   async serverWillStart() {
      //     return {
      //       async drainServer() {
      //         await serverCleanup.dispose();
      //       },
      //     };
      //   },
      // },
    ],
  });
  
  return apolloServer;
}

