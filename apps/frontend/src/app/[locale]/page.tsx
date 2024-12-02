import NavBarWrapper from '@/components/NavBarWrapper';
import * as React from 'react';
import Remain from '@/components/Home/Remain';
import Banner from '@/components/Home/Banner';
import Sale from '@/components/Home/Sale';
import About from '@/components/Home/About';
import Holder from '@/components/Home/Holder';
import BannerTitle from '@/components/Home/BannerTitle';
import BannerDescription from '@/components/Home/BannerDescription';
import Moon from '@/components/Home/Moon';
import BannerBottom from '@/components/Home/BannerBottom';
import TranslationsProvider from '@/context/TranslationsProvider';
import initTranslations from '@/app/i18n';
import getNamespaces from '@/app/i18n/i18nConfig';
export default async function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const ns = getNamespaces();
  const { resources } = await initTranslations(locale, ns);
   return (
<>
    <TranslationsProvider
    namespaces={ns}
    locale={locale}
    resources={resources}
  >
    
      <div className="bg-center bg-no-repeat flex flex-col gap-24 sm:gap-64 my-5">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="flex flex-col gap-8 sm:gap-20">
            <Banner locale={locale} />
            <Sale locale={locale} />
            <Remain locale={locale} />
            <About locale={locale} />
            <Holder locale={locale} />
          </div>
        </div>
      </div>
      </TranslationsProvider>
    </>
  );
};


