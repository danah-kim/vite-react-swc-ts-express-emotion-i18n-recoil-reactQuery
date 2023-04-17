// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import { dehydrate } from 'react-query';
import { renderPage } from 'vite-plugin-ssr/server';

// @ts-expect-error
import { getQueryClient } from '../src/libs/reactQuery.ts';
// @ts-expect-error
import { root } from './root.ts';

const isProduction = process.env.NODE_ENV === 'production';
process.env.WEB_BASE_URL = 'http://localhost';
process.env.API_BASE_URL = 'http://localhost/api';

startServer();

async function startServer() {
  const app = express();

  app.use(compression());
  app.set('trust proxy', true);
  app.disable('x-powered-by');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  if (isProduction) {
    const sirv = (await import('sirv')).default;
    app.use(sirv(`${root}/dist/client`));
  } else {
    const vite = await import('vite');
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: { middlewareMode: true },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  // Web Server API
  app.get('/health', (_, res) => {
    res.status(200).send('Ok');
  });

  app.get('*', async (req, res, next) => {
    const queryClient = getQueryClient();

    const pageContextInit = {
      urlOriginal: req.originalUrl,
      dehydratedState: dehydrate(queryClient),
      env: {
        API_BASE_URL: process.env.API_BASE_URL,
      },
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;

    if (!httpResponse) {
      next();
      return;
    }

    const { body, statusCode, contentType, earlyHints } = httpResponse;

    if (res.writeEarlyHints) {
      res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
    }

    res.status(statusCode).type(contentType).send(body);
  });

  const port = process.env.PORT ?? 3000;
  app.listen(port);

  console.log(`✅  server Listening on: ${process.env.WEB_BASE_URL} at ${process.env.NODE_ENV}`);
}
