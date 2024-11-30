import type { Metadata } from 'next';
import './globals.css';
import '@mysten/dapp-kit/dist/index.css';
import Context from '@/context/Context';
import initTranslations from '@/app/i18n';
import { dir } from 'i18next';
import i18nConfig from '@/i18nConfig';
import TranslationsProvider from '@/context/TranslationsProvider';
import InviteDialogSuspense from '@/components/InviteDialogSuspense';

export const metadata: Metadata = {
  title: 'Mercury World',
  description: 'Mercury World',
};

export const generateStaticParams = () => {
  return i18nConfig.locales.map((locale) => ({ locale }));
};

const RootLayout = async ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) => {
  const { locale } = await params;
  const { t, resources } = await initTranslations(
    locale,
    i18nConfig.i18nNamespaces,
  );

  return (
    <html lang={locale} dir={dir(locale)}>
      <body className="bg-black">
        <TranslationsProvider
          namespaces={i18nConfig.i18nNamespaces}
          locale={locale}
          resources={resources}
        >
          <Context>
            {children}
            <InviteDialogSuspense
              bindInviter={t('Bind Inviter')}
              inviterText={t('Inviter')}
              noInviter={t('No Inviter')}
              bindText={t('BIND')}
            />
          </Context>
        </TranslationsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
