import 'reflect-metadata';

import cors from 'cors';
import express from 'express';
import xss from 'src/services/xss-clean';

import logWelcome from 'src/util/logWelcome';
import helmet from 'helmet';
import {bindLoggerToGlobalErrorHandlers, logger} from 'src/services/Logger';
import PageNotFoundController from 'src/controllers/PageNotFound.controller';
import environment from 'src/config/environment';
import MutateSessionController from 'src/controllers/MutateSession.controller';
import {router as sessionQueuesRoutes} from 'src/jobs/queues/session.queue';
import {connectRedis} from 'src/services/redisClient';
import mongoConnection from 'src/services/MongoConnection';
import FunnelController from 'src/controllers/FunnelController.controller';

const {port, allowDomains, apiVersion} = environment;

export default async (): Promise<void> => {
  bindLoggerToGlobalErrorHandlers();
  await connectRedis();
  await mongoConnection.connect();

  const app = express();

  app.disable('x-powered-by');
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowDomains.indexOf(origin) !== -1) {
          callback(null, true);
          return;
        }
        const error = new Error('Not allowed by CORS');
        logger.error(error);
        callback(error);
      },
      credentials: true,
    })
  );
  app.use(helmet({contentSecurityPolicy: false}));
  app.use(xss());
  app.set('view engine', 'handlebars');
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  app.use('/admin/queues', sessionQueuesRoutes);
  app.get(`/api/${apiVersion}/funnel`, FunnelController);
  app.post(`/api/${apiVersion}/mutate-session`, MutateSessionController);

  app.use('*', PageNotFoundController);

  app.listen(port, logWelcome);
};
