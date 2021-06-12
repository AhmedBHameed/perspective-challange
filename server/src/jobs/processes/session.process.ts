import {Job} from 'bull';
import mutateSessionUseCase from 'src/use-case/MutateSession.usecase';

const sessionProcess = async (job: Job) => {
  return await mutateSessionUseCase.run(job.data);
};

export default sessionProcess;
