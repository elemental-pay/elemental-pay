#!/usr/bin/env node

const fs = require('fs').promises;
const { readFileSync, writeFileSync } = require('fs');
const nunjucks = require('nunjucks');

const template = readFileSync('./docker-compose.env.yml.template', 'utf-8');
const envTemplate = readFileSync('../server/.env.example', 'utf-8');
// const env = readFileSync('../../.env', 'utf-8'); TODO: 

const config = {
  ssoWebHost: {
    local: process.env.SSO_WEB_HOST_LOCAL || 'elemental-sso.local',
    staging: process.env.SSO_WEB_HOST_STAGING || 'sso-staging.elementalzcash.com',
    prod: process.env.SSO_WEB_HOST_PRODUCTION || 'sso.elementalzcash.com',
  },
  ssoApiHost: {
    local: process.env.SSO_API_HOST_LOCAL || 'api.elemental-sso.local',
    staging: process.env.SSO_API_HOST_STAGING || 'sso-staging-api.elementalzcash.com',
    prod: process.env.SSO_API_HOST_PRODUCTION || 'sso-api.elementalzcash.com',
  },
}

const crypto = require('crypto');

function generateToken(length) {
  const byteLength = Math.ceil((3/4) * length);
  const buffer = crypto.randomBytes(byteLength);
  return buffer.toString('base64').slice(0, length);
}

const getEnv = () => process.env.ENV || 'local';

// const client_secret = ;

const getDatabaseUrl = () => {
  const dbConfig = JSON.parse(readFileSync('../../database.config.json', 'utf-8'));
  const dbName = `elemental_pay_${getEnv()}`

  return `postgres://${dbName}:${dbConfig.databases[dbName].password}@database:5432/${dbName}`
}

const getServerEnv = () => ({
  appSettings: 'config.ProductionConfig',
  secretKey: generateToken(72),
  clientIdSsoSystem: generateToken(24),
  clientIdSsoApi: generateToken(24),
  clientIdElementalPayApi: generateToken(24),
  clientSecretSsoSystem: generateToken(72),
  clientSecretSsoApi: generateToken(72),
  clientSecretElementalPayApi: generateToken(72),
  databaseUrl: getDatabaseUrl(),
  databaseUrlTesting: process.env.DATABASE_URL_TESTING,
})


// api:
// build:
//   context: .
//   dockerfile: Dockerfile.dev
// restart: always
// volumes:
//   - ./:/app
//   - /app/node_modules
//   - /app/.next
// environment:
//   - VIRTUAL_HOST=api.elemental-sso.local
//   - VIRTUAL_PORT=8081
//   - NODE_ENV=development
//   - APP_ENV=local

const getTemplates = (env) => ({
  web: {
    serviceName: 'sso_web',
    virtualHost: config.ssoWebHost[env],
    virtualPort: 3000,
    nodeEnv: env === 'local' ? 'development' : 'production',
    nextEnv: env === 'prod' ? 'production' : env,
  },
  api: {
    serviceName: 'api',
    virtualHost: config.ssoApiHost[env],
    virtualPort: 8081,
    nodeEnv: env === 'local' ? 'development' : 'production',
    nextEnv: env === 'prod' ? 'production' : env,
  },
  server: {
    serviceName: 'sso_flask_server',
  }
});

const services = ['api', 'server', 'web'];
const environments = ['local', 'staging', 'prod'];

const main = async () => {
  for (const service of services) {
    for (const env of environments) {
      const data = getTemplates(env)[service];

      const output = nunjucks.renderString(template, {
        ...data,
        service,
        env,
      });
  
      writeFileSync(`../${service}/docker-compose.${env}.yml`, output);
    }
  }
  const serverEnvOutput = nunjucks.renderString(envTemplate, getServerEnv())
  writeFileSync('../server/.env', serverEnvOutput);
  
  // const data = {

  // }

  // const data = {
  //   serviceName: 'my-app',
  //   image: 'my-registry/my-app:latest',
  //   containerName: 'my-app-container',
  //   externalPort: 8080,
  //   internalPort: 3000,
  //   env: 'production',
  //   volume: '/my-app/data:/app/data'
  // };
  
  // const output = nunjucks.renderString(template, data);
  
  // fs.writeFileSync('docker-compose.yml', output);
};

main();
