import winston from 'winston';
// Winston-transport required for types only.
// eslint-disable-next-line
import Transport from 'winston-transport';

import environment from '../config/environment';

const {isProd} = environment;

export type Logger = winston.Logger;

const transports: Transport[] = [
  new winston.transports.File({
    level: environment.logs.level,
    filename: `${environment.logs.dir}/app.log`,
    handleExceptions: true,
    maxsize: 1000000, // 1MB
    maxFiles: 5,
  }),
];

if (!environment.isProd) {
  transports.push(new winston.transports.Console());
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.cli(), winston.format.splat()),
    })
  );
}

const logger = winston.createLogger({
  level: environment.logs.level,
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({stack: !isProd}),
    winston.format.splat(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports: transports,
});

const bindLoggerToGlobalErrorHandlers = () => {
  process
    .on('unhandledRejection', reason => {
      if (reason) {
        logger.error(`UNHANDLED_REJECTION:`, reason, () => {
          throw reason;
        });
      }
    })
    .on('uncaughtException', error => {
      logger.error(`UNCAUGHT_EXCEPTION:`, error, () => {
        throw error;
      });
    });
};

export {bindLoggerToGlobalErrorHandlers, logger};
