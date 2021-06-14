import {mockExpressMiddleware} from '../../test/express';
import {mockJobPayloadData} from '../../test/generate';
import FunnelControllerController from '../FunnelController.controller';

jest.mock('../../util/generateObjectId', () => () => 'TOKEN');

describe('FunnelControllerController', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it('response with data without cookie', async () => {
    const {req, res, mockSendFunction} = mockExpressMiddleware(
      mockJobPayloadData({pageId: '609a878b0cba83001fb5abd7', sentAt: new Date().toISOString()}),
      {
        clientPersistentId: 'W3hi37-xp--9_pG1jkwIz',
      }
    );

    await FunnelControllerController(req, res);
    expect(mockSendFunction).toHaveBeenCalledTimes(1);
    expect(mockSendFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        clientSessionId: expect.any(String),
      })
    );
  });

  it('response with data and cookie', async () => {
    const {req, res, mockSendFunction, mockCookieFunction} = mockExpressMiddleware(
      mockJobPayloadData({pageId: '609a878b0cba83001fb5abd7', sentAt: new Date().toISOString()})
    );

    await FunnelControllerController(req, res);
    expect(mockCookieFunction).toHaveBeenCalledTimes(1);
    expect(mockCookieFunction).toHaveBeenCalledWith('clientPersistentId', 'TOKEN', {httpOnly: true});
    expect(mockSendFunction).toHaveBeenCalledTimes(1);
    expect(mockSendFunction).toHaveBeenCalledWith({clientSessionId: 'TOKEN'});
  });
});
