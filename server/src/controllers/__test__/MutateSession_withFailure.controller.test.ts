const mockMutationSessionProcess = jest.fn(async () => {
  throw new Error('Throw async error');
});

jest.mock('../../use-case/MutateSession/MutateSession.usecase', () => mockMutationSessionProcess);

import {initiateRedisClient} from '../../test/redisServer';
import {mockJobPayloadData} from '../../test/generate';

import MutateSessionController from '../MutateSession.controller';
import {mockExpressMiddleware} from '../../test/express';

describe('MutateSessionController_WithFailure', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('response with 500 when async call throw error', async () => {
    /**
     * Wait redis client to connect to redis server.
     */
    const redisClient = await initiateRedisClient();
    const {req, res, mockSendFunction, mockStatusFunction} = mockExpressMiddleware(
      mockJobPayloadData({pageId: '609a878b0cba83001fb5abd7', sentAt: new Date().toISOString()})
    );

    await MutateSessionController(req, res);

    /**
     * We need to wait for the debounce function before the test is terminated.
     * It is safe to set larger delay that 250 (The value used in debounce function)
     */

    await new Promise(resolve => setTimeout(resolve, 1500));

    expect(mockStatusFunction).toHaveBeenCalledTimes(1);

    expect(mockSendFunction).toHaveBeenCalledTimes(1);
    expect(mockSendFunction).toHaveBeenCalledWith({error: 'Error in debounceJobFn: Oops! something went wrong!'});

    redisClient.disconnect();
  });
});
