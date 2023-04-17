import { PageLayout } from 'components';
import { PageContextProvider } from 'hooks/usePageContext';
import { http } from 'libs/http';
import { getQueryClient } from 'libs/reactQuery';
import { DebugObserver } from 'libs/recoil';
import { hydrateRoot } from 'react-dom/client';
import { Hydrate, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import { RecoilRoot } from 'recoil';
import { type PageContextClient } from 'types/page';

// This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
export async function render(pageContext: PageContextClient) {
  const queryClient = getQueryClient();
  const {
    Page,
    pageProps,
    is404,
    exports: { Layout = PageLayout },
    dehydratedState,
    token,
    env: { API_BASE_URL },
  } = pageContext;

  if (token) {
    http.getInstance().defaults.baseURL = API_BASE_URL;
    http.setAuthToken(token);
  } else {
    http.clearAuthorization();
    queryClient.removeQueries();
  }

  hydrateRoot(
    document.getElementById('page-view')!,
    <QueryClientProvider client={queryClient}>
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
          <DebugObserver />
        </RecoilRoot>
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

/* To enable Client-side Routing:
export const clientRouting = true
// !! WARNING !! Before doing so, read https://vite-plugin-ssr.com/clientRouting */
