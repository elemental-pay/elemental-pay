import http from 'http';
// import RedisServer from 'redis-server';
import { promisify } from 'util';
import dotenv from 'dotenv';
import { Client } from 'redis-om';
// import { Client as RedisOmClient } from './data/custom-redis-om-client';

dotenv.config();


import app from './app';
import { publisher, redisClient, subscriber } from './data';
import { initializeRedisOm } from './data/redis';

const port = process.env.PORT || 4040;

const server = http.createServer(app);

// export let redisOmClient: Client;


const onListening = async () => {
  const address = server.address();
  const bind = (typeof address === 'string') ? `pipe ${address}` : `port ${address.port}`;

  console.log(`Listening on: ${bind}`);

  await initializeRedisOm();

  // @ts-ignore
  // redisOmClient = await new RedisOmClient().use(_redisOmClient);
};


server.listen(port);

server.on('listening', onListening);

// subscriber.on('message', redisListener);
// subscriber.subscribe(['global', 'api']);

const serverCloseAsync = () => new Promise((resolve, reject) => {
  try {
    server.close(() => {
      resolve(null);
    });
  } catch (e) {
    reject(e);
  }
});


const onServerStop = async () => {
  try {
    try {
      await redisClient.quit();
      await subscriber.quit();
      await publisher.quit();
    } catch(err) {
      console.error(err);
      // suppress Redis quit errors for now
    }
    // await redisServer.close();
    await serverCloseAsync();

    console.log('Server stopped.');
    process.exit();
  } catch (err) {
    console.log('Failed to stop server');
  }
};

process.on('exit', onServerStop);

process.on('SIGINT', onServerStop);

process.on('SIGUSR1', onServerStop);
process.on('SIGUSR2', onServerStop);

