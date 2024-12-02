'use client';
import { I18nextProvider } from 'react-i18next';
import initTranslations from '@/app/i18n';
import { PropsWithChildren } from 'react';
import { Resource, createInstance } from 'i18next';
import { tranInstanceManager } from '@/hook';

const TranslationsProvider = ({
  children,
  locale,
  namespaces,
  resources,
}: PropsWithChildren<{
  locale: string;
  namespaces: string[];
  resources: Resource;
}>) => {
  const i18n = createInstance();

  tranInstanceManager.instance = i18n;

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;
