import {Request, Response} from 'express';
import validateMutateSessionInput from '../use-case/MutateSession/MutateSession.validation';
import debounceJobFn from '../jobs/queues/debounceJobFn';
import {sessionQueue} from '../jobs/queues/session.queue';
import {logger} from '../services/Logger';

const MutateSessionController = async (req: Request, res: Response) => {
  /**
   * Validate payload before any further steps.
   * Among validation, we are checking if there is a duplicate in "optIns" fields
   */
  const {error, value} = validateMutateSessionInput(req.body);
  if (error) {
    res.status(400).send(error.details);
    return;
  }

  /**
   * JobId is a combination of "pageId" and "sentAt" separated by ":"
   * JobId is used to prevent a double same job come from the same source.
   */
  const jobId = `${value.properties.pageId}:${+new Date(value.sentAt)}`;

  try {
    await debounceJobFn(value, jobId, sessionQueue, res);
  } catch (error) {
    logger.error('', error);
    res.status(500).send({error: 'Error in MutateSessionController: Oops! something went wrong!'});
  }
};

export default MutateSessionController;
