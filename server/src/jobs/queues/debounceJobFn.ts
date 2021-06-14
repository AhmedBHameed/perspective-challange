import Bull from 'bull';
import {Response} from 'express';
import {debounce} from 'lodash';
import {logger} from '../../services/Logger';
import {redisClient} from '../../services/redisClient';
import {getSessionIdAndTimestamp} from '../../util/getSessionIdAndTimestamp';

const debounceJobFn = debounce(async (payload: any, jobId: string, queue: Bull.Queue<any>, res: Response) => {
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
      const resultOrError = await activeJob.finished();

      if (resultOrError instanceof Error) {
        logger.error('', resultOrError);
        res.status(500).send({error: 'Error in debounceJobFn: Oops! something went wrong!'});
        return;
      }
      res.send(resultOrError);
    }
  } catch (error) {
    logger.error('', error);
    res.status(500).send({error: 'Error in debounceJobFn: Oops! something went wrong!'});
  }
}, 250);

export default debounceJobFn;
