const {BUILD_ENV, LOG_LEVEL, MONGODB_PASS, VERSION} = process.env;

const isProd = BUILD_ENV === 'production';

const port = '5000';
const allowDomains = ['http://localhost:5000'];

export default {
  allowDomains,
  apiVersion: 'v1',
  version: VERSION,
  isProd,
  logs: {
    dir: 'logs',
    level: LOG_LEVEL || 'silly',
  },
  port,
  database: {
    dbName: 'admin',
    password: MONGODB_PASS,
    port: 27017,
    server: 'mongo',
    user: 'super',
  },
  redis: {
    host: 'redis',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
};
