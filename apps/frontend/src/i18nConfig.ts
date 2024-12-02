import { Resource } from 'i18next';

const i18nConfig = {
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  i18nNamespaces: ['common'],
};

export const getOptions = (
  locale: string,
  namespaces?: string[],
  resources?: Resource,
) => {
  const ns = namespaces !== undefined ? namespaces : i18nConfig.i18nNamespaces;
  return {
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: ns[0],
    fallbackNS: ns[0],
    ns,
    preload: resources ? [] : i18nConfig.locales,
  };
};

export default i18nConfig;
