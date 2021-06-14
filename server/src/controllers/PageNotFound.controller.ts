import {Request, Response} from 'express';
import {readFileSync} from 'fs';
import hbs from 'handlebars';
import {minify} from 'html-minifier';

const PageNotFoundController = async (_: Request, res: Response) => {
  const template = readFileSync('src/views/404.handlebars', {encoding: 'utf-8'});
  const html = hbs.compile(template);

  res.send(
    minify(html({}), {
      collapseWhitespace: true,
      conservativeCollapse: true,
      keepClosingSlash: true,
      minifyCSS: true,
      minifyJS: true,
      minifyURLs: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeComments: true,
    })
  );
};

export default PageNotFoundController;
