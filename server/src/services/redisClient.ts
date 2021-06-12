import RedisClass, {Redis} from 'ioredis';
import environment from 'src/config/environment';

const {host, port} = environment.redis;

let redisClient: Redis;

const connectRedis = (): Promise<string> => {
  redisClient = new RedisClass({
    port,
    host,
    showFriendlyErrorStack: true,
  });

  return new Promise(resolve => {
    redisClient.on('connect', function () {
      resolve('Redis state: connected');
    });
  });
};

export {redisClient, connectRedis};
