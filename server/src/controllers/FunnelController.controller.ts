import {Request, Response} from 'express';
import objectId from '../util/generateObjectId';

/**
 * I'm not sure what are the purpose of points 5,6 in the assignment, but i guess those are
 * to show how can i manage the cookies and sessions via back-end.
 */
const FunnelController = async (req: Request, res: Response) => {
  const clientPersistentId = req.cookies?.['clientPersistentId'];

  /**
   * If first visit, means that `clientPersistentId` is empty so we have to generate a new one.
   * Otherwise, means the user already visited the funnel and has a `clientPersistentId` already.
   */
  if (!clientPersistentId) {
    res.cookie('clientPersistentId', objectId(), {httpOnly: true});
  }

  /**
   * Here with each time user load the funnel, we generate new `clientSessionId`.
   */
  res.send({
    clientSessionId: objectId(),
  });
};

export default FunnelController;
