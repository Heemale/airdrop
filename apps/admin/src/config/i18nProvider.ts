import polyglotI18nProvider from 'ra-i18n-polyglot';
import chineseMessages from '@haxqer/ra-language-chinese';

// @ts-ignore
export const i18nProvider = polyglotI18nProvider(
  () => chineseMessages,
  'zh_CN',
);
