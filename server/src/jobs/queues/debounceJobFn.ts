import Bull from 'bull';
import {Response} from 'express';
import {debounce} from 'lodash';
import logger from 'src/services/Logger';
import {redisClient} from 'src/services/redisClient';
import {getSessionIdAndTimestamp} from '../../util/getSessionIdAndTimestamp';

export const debounceJobFn = debounce(async (payload: any, jobId: string, queue: Bull.Queue<any>, res: Response) => {
  try {
    const [pageId] = getSessionIdAndTimestamp(jobId);
    const cachedKeys = await redisClient.keys(`${pageId}:*`);
    const jobKeyId = cachedKeys[0] || jobId;

    await redisClient.set(cachedKeys[0] || jobId, JSON.stringify(payload));

    const storedJobData = await redisClient.get(jobKeyId);
    if (storedJobData) {
      /**
       * JOB PRODUCER TYPE
       */
      const activeJob = await queue.add(JSON.parse(storedJobData), {jobId: jobKeyId}); // Important to set jobId.
      await redisClient.del([jobKeyId]);

      const result = await activeJob.finished();
      res.send(result);
    }
  } catch (error) {
    logger.error('', error);
    res.send({error: 'Error in debounceJobFn: Oops! something went wrong!'});
    throw error;
  }
}, 250);
