import { Redis } from 'ioredis';

export const createClient = (redis: Redis) => {
  // Hacky mutation...
  // @ts-ignore
  redis.hGetAll = redis.hgetall;
  // @ts-ignore
  redis.hSet = redis.hset;
  // @ts-ignore
  redis.executeIsolated = redis.exec;
  // @ts-ignore
  redis.__client = 'ioredis';
  // @ts-ignore
  redis.sendCustomCommand = (argList) => {
    const [firstArg, ...secondArgs] = argList;
    redis.call(firstArg, secondArgs);
  }

  return redis;
  // return Object.assign({}, redis, {
  //   hGetAll: redis.hgetall,
  //   hSet: redis.hset,
  //   executeIsolated: redis.exec,
  // });
};
