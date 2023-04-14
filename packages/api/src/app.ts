// const path = require('path');
import path from 'path';
import express, { Router } from 'express';
import helmet from 'helmet';
import { graphqlHTTP } from 'express-graphql';
import log from 'loglevel';
import fs from 'fs';
import { getIntrospectionQuery } from 'graphql';
import fetch from 'node-fetch';
import ExpressOAuthServer from 'express-oauth-server';
// import OAuth2Server from 'express-oauth-server';
import { isBefore, parse } from 'date-fns';
import cors from 'cors';

import { makeExecutableSchema } from '@graphql-tools/schema';

import typeDefs from './graphql/types';
import resolvers from './graphql/resolvers';

// import repositories from './repositories';
import routes from './routes';

// import { repos as Repositories, apiWrapper } from './data/api';
import { APIWrapper, UsersAPI } from './data/api';

// import { oAuthModel } from './oauth';
import { db } from './data';
import { extractBearerToken } from './utils';
import { AuthenticationError } from './errors';
import { UserType } from './models';
import { Viewer } from './types';
import { getUserFromAccessToken, oAuthClient } from './services/oauth.service';

// import { db } from './data/pg';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

interface WithOAuthServer {
  oauth?: ExpressOAuthServer
}

type AppInterface = express.Application & WithOAuthServer;

const app: AppInterface = express();


if (process.env.NODE_ENV === 'development') {
  log.setLevel(log.levels.DEBUG);
}
else if (process.env.NODE_ENV === 'production') {
  log.setLevel(log.levels.WARN);
}

const corsOptions = process.env.NODE_ENV === 'development' ? {
  origin: ['https://elemental-pay.local', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
} : {
  origin: ['https://staging.elementalpay.com', 'https://elementalpay.com'],
  optionsSuccessStatus: 200,
}

app
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cors(corsOptions))
  .use(helmet({
    // contentSecurityPolicy: {
    //   directives: {
    //     ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    //     'connect-src': ['\'self\'', 'https://elemental-sso.local'],
    //   },
    // }
  }));

// const repositories = Repositories;

// class _Viewer {
//   id: string;
//   data: Viewer;
//   constructor(data) {
//     if (data) {
//       this.id = data.uuid;
//       this.data = data;
//       // if (!data.isVerifiedEmail) {
//       //   this.data.isPublic = true;
//       // }
//     }
//   }
//   get publicId() {
//     return this.id;
//   }
//   toJSON(): Viewer {
//     if (!this.data/* || !this.id*/) {
//       return null;
//     }
//     return {
//       ...this.data,
//       uuid: this.id,
//       publicId: this.id,
//     };
//   }
//   get isVerified() {
//     return this.data.isVerifiedEmail;
//   }
//   static makePublicUser() {
//     return new this({
//       isPublic: true,
//       id: null, publicId: null, name: null, username: null,
//       email: null, totpSecret: null, pswd: null,
//       unverifiedEmail: null, isVerifiedEmail: null, joinedOn: null, roles: null
//     })
//   }
//   static makeSystemUser() {
//     return new this({
//       isSystem: true,
//       id: null, publicId: null, name: null, username: null,
//       email: null, totpSecret: null, pswd: null,
//       unverifiedEmail: null, isVerifiedEmail: null, joinedOn: null, roles: null
//     });
//   }
// }





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


  // try {
  //   if (!reqToken) {
  //     // throw new AuthenticationError('You must be logged in.');
  //     // TODO: Create guest viewer with rate limiting based on IP, etc, with HTML SSR for cache strategy
  //     const guestViewer = _Viewer.makePublicUser().toJSON();
  //     // log.debug({ guestViewer });
  //     return { request: req, ...guestRepositories, viewer: guestViewer, isPublic: true };
  //   }
  //   if (reqToken === process.env.SYSTEM_TOKEN) {
  //     const viewer = _Viewer.makeSystemUser();
  //     return { request: req, viewer: viewer.toJSON(), ...guestRepositories };
  //   }

  //   const apiWrapper = new APIWrapper(process.env.FLASK_API_URL, reqToken);

    

  //   const repositories = { users };
  //   // const token = await repositories.tokens.findByAccessToken(reqToken);
  //   // if (!(isBefore(Date.now(), new Date(token.accessTokenExpiresOn)))) {
  //   //   throw new AuthenticationError('Session has expired');
  //   // }
  //   const user = await getUserFromAccessToken(reqToken);
  //   const token = { userId: user.id };

  //   let viewer = new _Viewer((await repositories.users.getById({ isAuthenticating: true } as unknown as UserType, token.userId)));
  //   log.debug({ viewer });
  //   if (!viewer?.id) {
  //     throw new AuthenticationError('Failed to authenticate');
  //   }
  //   log.debug('viewer public id: ', viewer?.publicId);

  //   return { request: req, viewer: viewer.toJSON(), token, ...repositories };
  // } catch (error) {
  //   log.error(error);
  //   return undefined;
  // }
};

export type GraphQLContext = Awaited<ReturnType<typeof getContextFromRequest>>;

// password grant here
app.post('/oauth/token', (req, res) => {

  // console.log({ reqBody: req.body });
  app.oauth.token()(req, res);
});

app.post('/oauth/authorize', function(req, res) {
  // Redirect anonymous users to login page.
  // if (!req.app.locals.user) {
  //   return res.redirect(util.format('/login?client_id=%s&redirect_uri=%s', req.query.client_id, req.query.redirect_uri));
  // }

  return app.oauth.authorize();
});




app.use('/graphql', graphqlHTTP(async (request) => {
  return {
    schema,
    context: await getContextFromRequest(request),
    graphiql: process.env.NODE_ENV === 'development',
    introspection: process.env.NODE_ENV === 'development'
  };
}));

// TODO: Add auth for this and make it an API route
// app.use('/schema.json', async (req, res) => {
//   await fetch('http://localhost:8080/graphql', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ query: getIntrospectionQuery() })
//   })
//     .then(res => res.json())
//     .then(res =>
//       fs.writeFileSync(path.join(__dirname, './schema.json'), JSON.stringify(res.data, null, 2))
//     );

//   res.end();
// });

// Logging middleware
// app.use((req, res, next) => {
//   console.log(JSON.stringify({ url: req.url, body: req.body, params: req.params }));

//   next(req, res);
// });
// app.use((req, _, next) => {
//   console.log(JSON.stringify({ url: req.url, body: req.body, params: req.params }, null, 2));

//   next();
// });


routes(app);

const router = Router();

const routeMiddleware = routes(router);

app.use(routeMiddleware);

app.use((_, res) => {
  res.status(404).json({ statusCode: 404, error: 'Not Found', message: 'Page not found' });
});

app.use((err, req, res) => {
  // @ts-ignore
  res.locals.message = err.message;
  // @ts-ignore
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // @ts-ignore
  res.status(err.status || 500);

  // @ts-ignore
  res.end();
});

export default app;

