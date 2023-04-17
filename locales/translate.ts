import en from './en.json';
import ko from './ko.json';

const translations = {
  en,
  ko,
};

interface TranslateProps {
  id: keyof typeof en;
  params?: Record<string, string | number>;
  locale?: keyof typeof translations;
}

export function translate({ id, params, locale = 'en' }: TranslateProps) {
  const textTranslations = translations[locale];
  let text = Object.keys(textTranslations).some((textTranslation) => textTranslation === id)
    ? // @ts-expect-error
      textTranslations[id]
    : translations.en[id];

  if (params != null) {
    Object.entries(params).forEach(([key, value]) => {
      text = text.replace(`{${key}}`, String(value));
    });
  }

  return text;
}
