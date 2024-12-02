import { createInstance, Resource, i18n } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions } from '@/i18nConfig';
import { ITran } from '@/app/i18n/type';

const initTranslations = async (
  locale: string,
  namespaces: string[],
  i18nInstance?: i18n,
  resources?: Resource,
): Promise<{
  i18n: i18n;
  resources: Resource;
  t: any;
}> => {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/locales/${language}/${namespace}.json`),
      ),
    );
  }

  await i18nInstance.init(getOptions(locale, namespaces, resources));

  const t: ITran = (key, namespace, occupied) => {
    return (i18nInstance.t as any)(key, {
      ns: namespace ?? 'common',
      ...occupied,
    });
  };

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t,
  };
};

export default initTranslations;
