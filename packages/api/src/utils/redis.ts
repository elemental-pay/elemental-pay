import { SchemaDefinition } from 'redis-om';
import { models } from 'elemental-orm';

import { client } from '../data/redis';
import { objNotNull } from './misc';
import { ModelToType } from './types';

type UnknownObj = { [key: string]: unknown };

export const serialiseObjNest = (obj: UnknownObj): UnknownObj => {
  const res = {};
  Object.keys(obj).forEach((k) => {
    const v = obj[k];
    if (v instanceof Date) {
      res[k] = v.toISOString();
    } else if (typeof v === 'object' && v !== null) {
      res[k] = JSON.stringify({ ...v, __type__: 'JSON' });
    } else {
      res[k] = v;
    }
  });
  return res;
};

export const deserialiseObjectNest = (obj: UnknownObj): UnknownObj => {
  const res = {};
  Object.keys(obj).forEach((k) => {
    const v = obj[k];
    try {
      if (typeof v !== 'string') {
        throw new Error();
      }
      const json = JSON.parse(v);
      if (json.__type__ === 'JSON') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { __type__, ...vals } = json;
        res[k] = vals;
      } else {
        throw new Error();
      }
    } catch (e) {
      res[k] = v;
    }
  });
  return res;
};

export const cacheGet = async (key): Promise<unknown> => {
  const cachedVal = await client.hgetall(key);
  if (objNotNull(cachedVal)) {
    return deserialiseObjectNest(cachedVal);
  }
  return null;
};

export const cacheDelete = async (key) => await client.del(key);

export const cacheSet = async (key, data) => {
  if (!data) {
    return;
  }

  const res = await client.hset(key, serialiseObjNest(data));

  if (!res) {
    await cacheDelete(key);
    return;
  }

  return true;
};

export const makeRedisSave = redisClient => async (args, relations?) => {
  for (const rKey in args) {
    if (args[rKey]) {
      const value = Object.assign({}, args[rKey]);

      if (relations) {
        Object.keys(relations).forEach((_mapKey) => {
          // eslint-disable-next-line no-underscore-dangle
          const _mapValue = relations[_mapKey];
          const [tableTo, keyTo] = _mapKey.split('.');
          const [tableFrom, keyFrom] = _mapValue.split('.');

          if (rKey === tableTo) {
            value[keyTo] = args[tableFrom][keyFrom];
            // console.log({ value });
          }
        });
      }

      // console.log('hmset: ', { value });
      await redisClient.hmset(`${rKey}:${args[rKey].id}`, value);
    }
  }
};

export async function cacheSaveEntity<T extends models.Model, ModelType = ModelToType<T>>(
  data: ModelType, model: T, repo
) {
  if (!data || !model || !repo) {
    return null;
  }

  const _entity: ModelToType<T> = Object.keys(model.getFields()).reduce((acc, property) => {
    acc[property] = data[property];
    return acc;
  }, {}) as ModelToType<T>;

  const cachedUser = repo.createEntity(_entity);
  await repo.save(cachedUser);
  return data;
}

export async function cacheSearchEntity<T extends models.Model, ModelType = ModelToType<T>>(
  searchArg, model: T, repo,
): Promise<ModelType> {
  const [searchKey, searchValue] = Object.entries(searchArg)[0];
  const resultEntity = await repo.search().where(searchKey).equals(searchValue).return.first();

  if (!resultEntity) {
    return null;
  }

  const result: ModelType = Object.keys(model.getFields()).reduce((acc, property) => {
    acc[property] = resultEntity[property];
    return acc;
  }, {}) as ModelType;
  // const { id, ...entity } = _entity;

  return result;
}

export const getRedisSchemaFromModel = (Model: typeof models.Model): SchemaDefinition => {
  const model = new Model({} as any, {} as any);

  return Object.keys(model).reduce((acc, property) => {
    const val = model[property];

    if (val?.metadata?.__jsType) {
      // log.debug({ redisType: val.metadata.__redisType });
      acc[property] = { type: val.metadata.__redisType || val.metadata.__jsType };
    }
    return acc;
  }, { dbIndex: { type: 'number' }});
}
