const PROCESS_ENV = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_API_URL_STAGING: process.env.NEXT_PUBLIC_API_URL_STAGING,
  NEXT_PUBLIC_API_URL_PRODUCTION: process.env.NEXT_PUBLIC_API_URL_PRODUCTION,
  NEXT_PUBLIC_SSO_URL: process.env.NEXT_PUBLIC_SSO_URL,
  NEXT_PUBLIC_SSO_URL_STAGING: process.env.NEXT_PUBLIC_SSO_URL_STAGING,
  NEXT_PUBLIC_SSO_URL_PRODUCTION: process.env.NEXT_PUBLIC_SSO_URL_PRODUCTION,
  NEXT_PUBLIC_SSO_CLIENT_ID: process.env.NEXT_PUBLIC_SSO_CLIENT_ID,
  NEXT_PUBLIC_SSO_CLIENT_ID_STAGING: process.env.NEXT_PUBLIC_SSO_CLIENT_ID_STAGING,
  NEXT_PUBLIC_SSO_CLIENT_ID_PRODUCTION: process.env.NEXT_PUBLIC_SSO_CLIENT_ID_PRODUCTION,
};

const getEnvVarForAppEnv = (prefix, appEnv) => {
  const envVar = PROCESS_ENV[`${prefix}_${appEnv.toUpperCase()}`] || PROCESS_ENV[prefix];

  if (!envVar) {
    throw new Error(JSON.stringify({ a: 'No app environment found.', b: `${prefix}_${appEnv.toUpperCase()}`, c: PROCESS_ENV[prefix], d: prefix }));
  }
  return envVar;
}

const getApiUrl = (appEnvironment) =>
  getEnvVarForAppEnv('NEXT_PUBLIC_API_URL', appEnvironment);

export const config = {
  GRAPHQL_API_URL: `${getApiUrl(process.env.NEXT_PUBLIC_APP_ENV)}/graphql`,
  OAUTH_URL: `${getApiUrl(process.env.NEXT_PUBLIC_APP_ENV)}/oauth`,
  SSO_CLIENT_ID: getEnvVarForAppEnv('NEXT_PUBLIC_SSO_CLIENT_ID', process.env.NEXT_PUBLIC_APP_ENV),
  SSO_URL: getEnvVarForAppEnv('NEXT_PUBLIC_SSO_URL', process.env.NEXT_PUBLIC_APP_ENV)
};
