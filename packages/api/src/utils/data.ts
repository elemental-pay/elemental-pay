import * as RedisUtils from './redis';

export const saveAndCacheSet = async (key, dbFunc, transformFunc) => {
  const res = transformFunc(await dbFunc());

  if (!(await RedisUtils.cacheSet(key, res))) {
    console.log({ res });
    return;
  }
  return res;
};

export const cacheGetOrSet = async (key, dbFunc, transformFunc): Promise<unknown> => {
  let res = await RedisUtils.cacheGet(key);

  if (!res) {
    res = await saveAndCacheSet(key, dbFunc, transformFunc);

    if (!res) {
      // throw new NotFoundError();
      return;
    }
    console.log('setting cache', { res });
  } else {
    console.log('getting from cache', { res });
  }

  return res;
};
