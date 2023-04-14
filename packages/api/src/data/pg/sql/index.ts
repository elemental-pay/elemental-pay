import pgPromisePkg from 'pg-promise';
const { QueryFile } = pgPromisePkg;
import { fileURLToPath } from 'url';
import path from 'path';

// import { getDirname } from '../../utils';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// function sql(file) {
//   const fullPath = path.join(__dirname, file); // generating full path;
//   return new QueryFile(fullPath, { minify: true });
// }
const sql = (a: string): any => {};

const reset = sql('reset.sql');

const users = {
  create: sql('user/create.sql'),
  add: sql('user/add.sql'),
  update: sql('user/update.sql'),
  remove: sql('user/remove.sql'),
  removeById: sql('user/remove-by-id.sql'),
  find: sql('user/find.sql'),
  drop: sql('user/drop.sql'),
  empty: sql('user/empty.sql'),
  // add: sql('users/add.sql'),
  // search: sql('users/search.sql'),
  // report: sql('users/report.sql'),
};

const oauthTokens = {
  create: sql('oauth/oauth_tokens/create.sql'),
  drop: sql('oauth/oauth_tokens/drop.sql'),
  empty: sql('oauth/oauth_tokens/empty.sql'),
  remove: sql('oauth/oauth_tokens/remove.sql'),
  add: sql('oauth/oauth_tokens/add.sql'),
  find: sql('oauth/oauth_tokens/find.sql'),
};

const oauthAuthorizationCodes = {
  create: sql('oauth/oauth_authorization_codes/create.sql'),
  drop: sql('oauth/oauth_authorization_codes/drop.sql'),
  empty: sql('oauth/oauth_authorization_codes/empty.sql'),
  add: sql('oauth/oauth_authorization_codes/add.sql'),
  find: sql('oauth/oauth_authorization_codes/find.sql'),
  findByUserId: sql('oauth/oauth_authorization_codes/find-by-user-id.sql'),
};

const oauthClients = {
  create: sql('oauth/oauth_clients/create.sql'),
  drop: sql('oauth/oauth_clients/drop.sql'),
  empty: sql('oauth/oauth_clients/empty.sql'),
  init: sql('oauth/oauth_clients/init.sql'),
};

const oauthScopes = {
  create: sql('oauth/oauth_scopes/create.sql'),
  drop: sql('oauth/oauth_scopes/drop.sql'),
  empty: sql('oauth/oauth_scopes/empty.sql'),
};


export {
  reset,
  users,
  oauthTokens,
  oauthAuthorizationCodes,
  oauthScopes,
  oauthClients,
};
