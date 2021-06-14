const mockMutationSessionProcess = jest.fn(async () => ({data: 'mock response'}));

jest.mock('../../use-case/MutateSession/MutateSession.usecase', () => mockMutationSessionProcess);

import {initiateRedisClient} from '../../test/redisServer';
import {mockJobPayloadData} from '../../test/generate';

import MutateSessionController from '../MutateSession.controller';
import {mockExpressMiddleware} from '../../test/express';

describe('MutateSessionController', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('response with 400 when invalid body data detected', async () => {
    const {req, res, mockSendFunction, mockStatusFunction} = mockExpressMiddleware(
      mockJobPayloadData({pageId: undefined, sentAt: new Date().toISOString()})
    );

    await MutateSessionController(req, res);

    expect(mockStatusFunction).toHaveBeenCalledTimes(1);
    expect(mockStatusFunction).toHaveBeenCalledWith(400);
    expect(mockSendFunction).toHaveBeenCalledTimes(1);
    expect(mockSendFunction).toHaveBeenCalledWith([
      {
        context: {key: 'pageId', label: 'properties.pageId'},
        message: '"properties.pageId" is required',
        path: ['properties', 'pageId'],
        type: 'any.required',
      },
    ]);
  });

  it('response with 200 when invalid body data detected', async () => {
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

    expect(mockStatusFunction).toHaveBeenCalledTimes(0);
    expect(mockSendFunction).toHaveBeenCalledTimes(1);
    expect(mockSendFunction).toHaveBeenCalledWith({data: 'mock response'});
    // expect(mockMutateSessionFn).toHaveBeenCalledTimes(1);
    // expect(mockMutateSessionFn).toHaveBeenCalledWith(null);

    // expect(mockSendFunction).toHaveBeenCalledTimes(1);
    // expect(mockSendFunction).toHaveBeenCalledWith(1);

    redisClient.disconnect();

    // expect(mockDebounceFn).toHaveBeenCalledWith(400);
    // expect(mockSendFunction).toHaveBeenCalledTimes(1);
    // expect(mockSendFunction).toHaveBeenCalledWith([
    //   {
    //     context: {key: 'pageId', label: 'properties.pageId'},
    //     message: '"properties.pageId" is required',
    //     path: ['properties', 'pageId'],
    //     type: 'any.required',
    //   },
    // ]);
  });
});
