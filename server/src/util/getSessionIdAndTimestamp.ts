import {JobId} from 'bull';

export const getSessionIdAndTimestamp = (jobId?: JobId) => (jobId ? jobId.toString().split(':') : '');
