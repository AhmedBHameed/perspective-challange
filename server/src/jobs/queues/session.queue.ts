import Bull from 'bull';
import environment from '../../config/environment';
import sessionProcess from '../processes/session.process';
import {createBullBoard} from 'bull-board';
import {BullAdapter} from 'bull-board/bullAdapter';
import {logger} from '../../services/Logger';

const {redis} = environment;

// Number of workers.
export const concurrency = 4;
const sessionQueue = new Bull('session', {
  redis: {
    host: redis.host,
    port: redis.port,
  },
});

/**
 * JOB EVENT LISTENER TYPE
 * It is recommended to monitor stalled jobs to prevent any job loss.
 * @see https://github.com/OptimalBits/bull#important-notes
 */
sessionQueue.on('stalled', job => {
  logger.info('', job);
});

/**
 * JOB CONSUMER TYPE
 */
sessionQueue.process(concurrency, sessionProcess);

// To create Bull board for easy monitoring.
const {router} = createBullBoard([new BullAdapter(sessionQueue)]);

export {sessionQueue, router};
