import type { Metadata } from 'next';
import './globals.css';
import '@mysten/dapp-kit/dist/index.css';
import Context from '@/context/Context';
import initTranslations from '@/app/i18n';
import { dir } from "i18next";
import i18nConfig from "../i18n/i18nConfig";

import TranslationsProvider from '@/context/TranslationsProvider';
import InviteDialogSuspense from '@/components/InviteDialogSuspense';

export const metadata: Metadata = {
  title: 'Mercury World',
  description: 'Mercury World',
};

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} dir={dir(locale)} data-theme='winter'>
      <body className="bg-black">

          <Context>
            {children}
            <InviteDialogSuspense
              bindInviter={t('Bind Inviter')}
              inviterText={t('Inviter')}
              noInviter={t('No Inviter')}
              bindText={t('BIND')}
            />
          </Context>
       
      </body>
    </html>
  );
};

