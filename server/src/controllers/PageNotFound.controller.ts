import {Request, Response} from 'express';
import {readFileSync} from 'fs';
import hbs from 'handlebars';

const PageNotFoundController = async (req: Request, res: Response) => {
  const template = readFileSync('src/views/404.handlebars', {encoding: 'utf-8'});
  const html = hbs.compile(template);

  res.send(html({}));
};

export default PageNotFoundController;
