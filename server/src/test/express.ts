export const mockExpressMiddleware = (body?: any, cookies?: any) => {
  const mockStatusFunction = jest.fn(() => res);
  const mockSendFunction = jest.fn(() => res);
  const mockCookieFunction = jest.fn();
  const req: any = {
    body,
    cookies,
  };

  const res: any = {send: mockSendFunction, cookie: mockCookieFunction, status: mockStatusFunction};

  return {
    res,
    req,
    mockCookieFunction,
    mockStatusFunction,
    mockSendFunction,
  };
};
