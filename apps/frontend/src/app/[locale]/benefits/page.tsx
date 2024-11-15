import NavBar from '@/components/NavBar';
import * as React from 'react';
import Link from 'next/link';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const Home = async (props: Props) => {
  const { locale } = props;
  const { t, resources } = await initTranslations(
    locale,
    i18nConfig.i18nNamespaces,
  );
  return (
    <>
      <NavBar locale={locale} />
      <div className="flex flex-col gap-24 sm:gap-64 my-4 sm:my-5 mx-6">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="w-full flex flex-col gap-6 text-white">
            <Link href={'/event'} className="cursor-pointer">
              {'< Events'}
            </Link>
            <div className="flex gap-6">
              <Link href={'/airdrop-list'}>
                <div className="text-center cursor-pointer">
                  <div className="text-white text-xl font-bold">Airdrops</div>
                  <div className="w-1/2 h-1 bg-gradient-to-r from-[#ffbdad] to-[#e7534f] mx-auto mt-2 rounded-3xl"></div>
                </div>
              </Link>
              <Link href={'/benefits'}>
                <div className="text-center cursor-pointer">
                  <div className="text-white text-xl font-bold">
                    {t('My Airdrop Benefits')}
                  </div>
                  <div className="w-1/2 h-1 bg-gradient-to-r from-[#ffbdad] to-[#e7534f] mx-auto mt-2 rounded-3xl"></div>
                </div>
              </Link>
            </div>
            <div className="text-sm">{t('Coming soon...')}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
