import { extractLocale } from 'locales';
import { type PageContextRouter } from 'types/page';

export function onBeforeRoute(pageContext: PageContextRouter) {
  const { urlOriginal } = pageContext;
  const { urlWithoutLocale, locale } = extractLocale(urlOriginal);

  return {
    pageContext: {
      locale,
      urlOriginal: urlWithoutLocale,
    },
  };
}
