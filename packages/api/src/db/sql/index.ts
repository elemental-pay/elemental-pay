import { QueryFile } from 'pg-promise';
import path from 'path';

function sql(file) {
  const fullPath = path.join(__dirname, file);
  return new QueryFile(fullPath, { minify: true });
}

const reset = sql('reset.sql');

const users = {
  create: sql('users/create.sql'),
};

// const tokens = {
//   create: sql('tokens/create.sql'),
// };

// const authorization = {
//   create: sql('authorization/create.sql'),
// };

// const oauthClients = {
//   create: sql('oauth_clients/create.sql'),
// };

export {
  reset,
  // external queries for Users:
  users,
  // tokens,
  // authorization,
  // oauthClients,
};
