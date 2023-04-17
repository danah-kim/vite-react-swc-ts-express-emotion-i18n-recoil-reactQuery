import { usePageContext } from 'hooks/usePageContext';
import type en from 'locales/en.json';
import { translate } from 'locales/translate';
import { createElement, type FC, type HTMLAttributes, type PropsWithChildren } from 'react';

interface LocaleTextProps extends HTMLAttributes<HTMLElement> {
  id: keyof typeof en;
  isHtml?: boolean;
  type?: string;
}

export const LocaleText: FC<PropsWithChildren<LocaleTextProps>> = ({ id, isHtml = false, type = 'span', ...props }) => {
  const { locale } = usePageContext();
  const textLocalized = translate({ id, locale: locale || 'en' });

  return isHtml ? (
    createElement(type, { dangerouslySetInnerHTML: { __html: textLocalized.replace(/\\n/gi, '<br />') }, ...props })
  ) : (
    <>{textLocalized}</>
  );
};
