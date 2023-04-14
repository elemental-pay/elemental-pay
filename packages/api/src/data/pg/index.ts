import pgPromise, { IDatabase } from 'pg-promise';

import { IExtensions, UsersRepository, TokensRepository, AuthorizationCodesRepository, ClientsRepository,  } from './repos';
import { users as usersSql, oauthTokens as tokensSql, oauthAuthorizationCodes as authCodesSql, oauthClients as clientsSql } from './sql';

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;

const initOptions = {
  capSQL: true,
  extend(obj: ExtendedProtocol, dc: any) {
    // Database Context (dc) is mainly needed for extending multiple databases with different access API.

    // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
    // which should be as fast as possible.
    obj.users = new UsersRepository(obj, pg, null, usersSql);
    obj.tokens = new TokensRepository(obj, pg, null, tokensSql);
    obj.authorizationCodes = new AuthorizationCodesRepository(obj, pg, null, authCodesSql);
    obj.clients = new ClientsRepository(obj, pg, null, clientsSql);
    // obj.products = new ProductsRepository(obj, pgp);
  }
};

const config = {
  // host: 'postgres',
  host: 'postgres',
  port: 5432,
  database: process.env.POSTGRES_DATABASE,
  user: process.env.POSTGRES_USERNAME,
  // password: process.env.POSTGRES_PSWD,
};

const pg = pgPromise(initOptions);

const db = pg(config);

export { pg, db };

