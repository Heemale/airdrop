import polyglotI18nProvider from 'ra-i18n-polyglot';
import chineseMessages from '@haxqer/ra-language-chinese';
import { TranslationMessages } from 'ra-core';

const messages: Record<string, TranslationMessages> = {
  zh_CN: chineseMessages as TranslationMessages,
};

export const i18nProvider = polyglotI18nProvider(
  (locale) => messages[locale],
  'zh_CN',
);
