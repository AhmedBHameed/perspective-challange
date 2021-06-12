import logger from 'src/services/Logger';

const initLogger = () => {
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

export default initLogger;
