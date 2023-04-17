import { localeDefault, locales } from './locales';

function extractLocale(url: string) {
  const urlPaths = url.split('/');

  let locale;
  let urlWithoutLocale;

  const firstPath = urlPaths[1] as 'en' | 'ko';
  if (locales.filter((locale) => locale !== localeDefault).includes(firstPath)) {
    locale = firstPath;
    urlWithoutLocale = '/' + urlPaths.slice(2).join('/');
  } else {
    locale = localeDefault;
    urlWithoutLocale = url;
  }

  return { locale, urlWithoutLocale };
}

export { extractLocale };
