import { PageLayout } from 'components';
import { PageContextProvider } from 'hooks/usePageContext';
import { getQueryClient } from 'libs/reactQuery';
import { translate } from 'locales';
import { renderToString } from 'react-dom/server';
import { Hydrate, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';
import { type PageContextServer } from 'types/page';
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr/server';

import logoUrl from './logo.svg';

// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = ['pageProps', 'urlPathname', 'is404', 'dehydratedState', 'token', 'env', 'locale'];

export async function render(pageContext: PageContextServer) {
  const {
    Page,
    pageProps,
    is404,
    dehydratedState,
    locale,
    exports: { Layout = PageLayout },
  } = pageContext;
  // This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
  if (!Page) {
    throw new Error('My render() hook expects pageContext.Page to be defined');
  }
  const pageHtml = renderToString(
    <QueryClientProvider client={getQueryClient()}>
      <Hydrate state={dehydratedState}>
        <RecoilRoot>
          <PageContextProvider pageContext={pageContext}>
            {!is404 ? (
              <Layout>
                <Page {...pageProps} />
              </Layout>
            ) : (
              <Page {...pageProps} />
            )}
          </PageContextProvider>
          <ToastContainer />
        </RecoilRoot>
      </Hydrate>
    </QueryClientProvider>
  );

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports;
  const title = documentProps?.title ?? translate({ id: 'title', locale });
  const desc = documentProps?.description ?? translate({ id: 'description', locale });

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang=${locale}>
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
