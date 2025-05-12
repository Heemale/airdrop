import polyglotI18nProvider from 'ra-i18n-polyglot';
import chineseMessages from '@haxqer/ra-language-chinese';

export const i18nProvider = polyglotI18nProvider(
  // @ts-ignore
  () => chineseMessages,
  'zh_CN',
);
