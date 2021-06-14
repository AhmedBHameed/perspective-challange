import {JobId} from 'bull';

export const getSessionIdAndTimestamp = (jobId: JobId) => jobId.toString().split(':');
