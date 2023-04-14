import Redis from 'ioredis';
import { Client, Repository } from 'redis-om';
import { Client as RedisOmClient } from './custom-redis-om-client';
import { promisify } from 'util';

import { createClient } from './io-redis-adapter';
import makeRedisRepos, { AuthorizationCodeEntity, OAuthClientEntity, OAuthTokenEntity, UserEntity } from './repos';

// import { makeRedisSave } from '../utils/redis';

// type RedisConnection = ReturnType<typeof createClientRedis>;

const redisArgs = {
  port: 6379,
  host: 'redis',
  password: process.env.REDIS_PSWD || '',
};

export const client = new Redis(redisArgs);
export const publisher = new Redis(redisArgs);
export const subscriber = new Redis(redisArgs);

export const ioredisOmClient = createClient(new Redis(redisArgs)) as any;

export const redisOm: {
  isInitialized: boolean,
  redisOmClient?: Exclude<Client, "redis">,
  repos: {
    users?: Repository<UserEntity>,
    tokens?: Repository<OAuthTokenEntity>,
    clients?: Repository<OAuthClientEntity>,
    authorizationCodes?: Repository<AuthorizationCodeEntity>,
  },
} = {
  isInitialized: false,
  redisOmClient: null,
  repos: {},
};

export const initializeRedisOm = async () => {
  const client = new RedisOmClient();

  const redisOmClient = await client.use(ioredisOmClient); // @ts-ignore 
  redisOm.redisOmClient = redisOmClient;
  redisOm.repos = makeRedisRepos(redisOm.redisOmClient);
  redisOm.isInitialized = true;

  await redisOm.repos.users.createIndex();
  await redisOm.repos.tokens.createIndex();
  await redisOm.repos.clients.createIndex();
  await redisOm.repos.authorizationCodes.createIndex();
};


// const { redisOmClient } = redisOm;



// @ts-ignore
// export const omClient = (async () => await new Client().use(redisOmClient))();

export const publish = publisher.publish;
export const subscribe = subscriber.subscribe;

// export const saveRedis = makeRedisSave(client);

export const getBuffer = client.getBuffer;
