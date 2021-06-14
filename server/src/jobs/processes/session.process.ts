import {DoneCallback, Job} from 'bull';
import upsertMutateSessionData from '../../use-case/MutateSession/MutateSession.usecase';

const sessionProcess = async (job: Job, done: DoneCallback) => {
  try {
    const data = await upsertMutateSessionData(job.data);
    done(null, data);
  } catch (error) {
    done(error, null);
  }
};

export default sessionProcess;
