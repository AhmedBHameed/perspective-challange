import PageNotFoundController from '../PageNotFound.controller';

describe('PageNotFoundController', () => {
  it('response with page not found template', async () => {
    const req: any = {};

    const mockSendFunction = jest.fn(() => res);
    const res: any = {send: mockSendFunction};

    await PageNotFoundController(req, res);
    expect(mockSendFunction).toHaveBeenCalledTimes(1);
    expect(mockSendFunction).toHaveBeenCalledWith(
      `<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta name="viewport" content="width=device-width,initial-scale=1"> <title>404</title> </head> <body> <h1>Page not found!</h1> </body> </html>`
    );
  });
});
