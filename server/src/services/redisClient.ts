import RedisClass, {Redis} from 'ioredis';
import environment from '../config/environment';
import {logger} from './Logger';

const {host, port} = environment.redis;

let redisClient: Redis;

const connectRedis = (): Promise<RedisClass.Redis> => {
  redisClient = new RedisClass({
    port,
    host,
    showFriendlyErrorStack: true,
    reconnectOnError: error => {
      logger.error('ConnectRedis', error);
      return true;
    },
  });

  return new Promise(resolve => {
    redisClient.on('connect', function () {
      resolve(redisClient);
    });
  });
};

export {redisClient, connectRedis};
