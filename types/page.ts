import type { PropsWithChildren, ReactElement } from 'react';
import { type DehydratedState } from 'react-query';
import type {
  PageContextBuiltIn,
  /*
        // When using Client Routing https://vite-plugin-ssr.com/clientRouting
        PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
        / */
  // When using Server Routing
  PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient,
  //* /
} from 'vite-plugin-ssr/types';

type Page = (pageProps: PageProps) => ReactElement;
export interface PageProps {}

export interface PageContextCustom {
  Page: Page;
  pageProps?: PageProps;
  urlPathname: string;
  exports: {
    documentProps?: {
      title?: string;
      description?: string;
    };
    Layout: (props: PropsWithChildren) => JSX.Element;
  };
  urlOriginal: string;
  locale: 'en' | 'ko';
  token: string | undefined;
  user: string | undefined;
  dehydratedState: DehydratedState;
  env: {
    API_BASE_URL: string;
  };
}

export type PageContextRouter = PageContextBuiltIn<Page> &
  Pick<PageContextCustom, 'urlOriginal' | 'token' | 'dehydratedState'>;
export type PageContextServer = PageContextBuiltIn<Page> & PageContextCustom;
export type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom;

export type PageContext = PageContextClient | PageContextServer;
