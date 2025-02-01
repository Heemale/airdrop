import NavBarWrapper from '@/components/NavBarWrapper';
import * as React from 'react';
import AirdropList from '@/components/Event/AirdropList';
import Link from 'next/link';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  params: Promise<{ locale: string }>;
}

const Home = async (props: Props) => {
  const { params } = props;
  const { locale } = await params;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <>
      <NavBarWrapper />
      <div className="flex flex-col gap-24 sm:gap-64 my-4 sm:my-5 mx-6">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="w-full max-w-[1260px] flex flex-col gap-6 text-white">
            <Link href={'/event'} className="cursor-pointer">
              {'< '}
              {t('Airdrops')}
            </Link>
            <div className="flex gap-6">
              <Link href={'/airdrop-list'}>
                <div className="text-center cursor-pointer">
                  <div className="text-white text-xl font-bold">
                    {t('Airdrops')}
                  </div>
                  <div className="w-1/2 h-1 bg-gradient-to-r from-[#40cafd] to-[#1993ee] mx-auto mt-2 rounded-3xl"></div>
                </div>
              </Link>
              <Link href={'/benefits'}>
                <div className="text-center cursor-pointer">
                  <div className="text-white text-xl font-bold">
                    {t('My Airdrop Benefits')}
                  </div>
                  <div className="w-1/2 h-1 bg-gradient-to-r from-[#40cafd] to-[#1993ee] mx-auto mt-2 rounded-3xl"></div>
                </div>
              </Link>
            </div>
            <div className="text-sm">
              {t('Purchase equity status to receive airdrop rewards!')}
            </div>
            <AirdropList
              ongoingText={t('ongoing')}
              chainText={t('Chain')}
              totalCopies={t('Total number of copies')}
              rewardQuantityPerCopy={t('Reward Quantity per Copy')}
              unpurchasedNode={t('UNPURCHASED EQUITY')}
              claimText={t('CLAIM')}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
