// @ts-nocheck
// Hacked together fork of redis-om
// FIXME: Contribute adapter system to redis-om
import { Repository, RedisError } from 'redis-om/dist/index';
import { createClient } from 'redis';

var HashRepository = class extends Repository {
  async writeEntity(entity) {
    const data = entity.toRedisHash();
    if (Object.keys(data).length === 0) {
      await this.client.unlink(entity.keyName);
      return;
    }
    await this.client.hsetall(entity.keyName, data);
  }
  async readEntities(ids) {
    return Promise.all(ids.map(async (id) => {
      const key = this.makeKey(id);
      const hashData = await this.client.hgetall(key);
      const entity = new this.schema.entityCtor(this.schema, id);
      entity.fromRedisHash(hashData);
      return entity;
    }));
  }
};
var JsonRepository = class extends Repository {
  async writeEntity(entity) {
    await this.client.jsonset(entity.keyName, entity.toRedisJson());
  }
  async readEntities(ids) {
    return Promise.all(ids.map(async (id) => {
      const key = this.makeKey(id);
      const jsonData = await this.client.jsonget(key);
      const entity = new this.schema.entityCtor(this.schema, id);
      entity.fromRedisJson(jsonData);
      return entity;
    }));
  }
};

export var Client = class {
  redis;
  async use(connection) {
    await this.close();
    this.redis = connection;
    return this;
  }
  async open(url = "redis://localhost:6379") {
    if (!this.isOpen()) {
      this.redis = (0, createClient)({ url });
      await this.redis.connect();
    }
    return this;
  }
  async execute(command) {
    this.validateRedisOpen();
    return this.redis.call(command.map((arg) => {
      if (arg === false)
        return "0";
      if (arg === true)
        return "1";
      return arg.toString();
    }));
  }
  fetchRepository(schema) {
    this.validateRedisOpen();
    if (schema.dataStructure === "JSON") {
      return new JsonRepository(schema, this);
    } else {
      return new HashRepository(schema, this);
    }
  }
  async close() {
    if (this.redis) {
      await this.redis.quit();
    }
    this.redis = void 0;
  }
  async createIndex(options) {
    this.validateRedisOpen();
    const { indexName, dataStructure, prefix, schema, stopWords } = options;
    const command = [
      "FT.CREATE",
      indexName,
      "ON",
      dataStructure,
      "PREFIX",
      "1",
      `${prefix}`
    ];
    if (stopWords !== void 0)
      command.push("STOPWORDS", `${stopWords.length}`, ...stopWords);
    command.push("SCHEMA", ...schema)

    const [cmd, ...cmdArguments] = command;
    await this.redis.call(cmd, cmdArguments);
    // await this.redis.call(command);
  }
  async dropIndex(indexName) {
    this.validateRedisOpen();
    await this.redis.call("FT.DROPINDEX", indexName);
  }
  async search(options) {
    this.validateRedisOpen();
    const { indexName, query, limit, sort, keysOnly } = options;
    const command = ["FT.SEARCH", indexName, query];
    if (limit !== void 0)
      command.push("LIMIT", limit.offset.toString(), limit.count.toString());
    if (sort !== void 0)
      command.push("SORTBY", sort.field, sort.order);
    if (keysOnly)
      command.push("RETURN", "0");

    // console.log({ command });
    // console.log({ modifiedCommand: command.map(args => (['call', ...args])) });
    const [cmd, ...cmdArguments] = command;
    return this.redis.call(cmd, cmdArguments);
    // return this.redis.call(command);
  }
  async unlink(...keys) {
    this.validateRedisOpen();
    if (keys.length > 0)
      await this.redis.unlink(keys);
  }
  async expire(key, ttl) {
    this.validateRedisOpen();
    await this.redis.expire(key, ttl);
  }
  async get(key) {
    this.validateRedisOpen();
    return this.redis.get(key);
  }
  async set(key, value) {
    this.validateRedisOpen();
    await this.redis.set(key, value);
  }
  async hgetall(key) {
    this.validateRedisOpen();
    return this.redis.hGetAll(key);
  }
  async hsetall(key, data) {
    this.validateRedisOpen();
    try {
      await this.redis.executeIsolated(async (isolatedClient) => {
        await isolatedClient.watch(key);
        await isolatedClient.multi().unlink(key).hSet(key, data).exec();
      });
    } catch (error) {
      if (error.name === "WatchError")
        throw new RedisError("Watch error when setting HASH.");
      throw error;
    }
  }
  async jsonget(key) {
    this.validateRedisOpen();
    const json = this.redis.__client && this.redis.__client === 'ioredis'
      ? await this.redis.call('JSON.GET', [key, "."])
      : await this.redis.sendCommand<string>(['JSON.GET', key, '.']);
    return JSON.parse(json);
  }
  async jsonset(key, data) {
    this.validateRedisOpen();
    const json = JSON.stringify(data);
    if (this.redis.__client && this.redis.__client === 'ioredis') {
      await this.redis.call('JSON.SET', [key, ".", json]);
    } else {
      await this.redis.sendCommand<string>(['JSON.SET', key, '.', json]);
    }
  }
  isOpen() {
    return !!this.redis;
  }
  validateRedisOpen() {
    if (!this.redis)
      throw new RedisError("Redis connection needs to be open.");
  }
};
