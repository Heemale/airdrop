import NavBarWrapper from '@/components/NavBarWrapper';
import * as React from 'react';
import Banner from '@/components/Event/Banner';
import Announcement from '@/components/Event/Announcement';
import AirdropsHeader from '@/components/Event/AirdropsHeader';
import AirdropList from '@/components/Event/AirdropList';
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
      <NavBarWrapper locale={locale} />
      <div className="flex flex-col gap-24 sm:gap-64 my-4 sm:my-5 mx-6">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="flex flex-col gap-8 sm:gap-20 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-10">
              <Banner />
              <Announcement locale={locale} />
            </div>
            <AirdropsHeader locale={locale} />
            <AirdropList
              isOngoing
              ongoingText={t('ongoing')}
              chainText={t('Chain')}
              totalCopies={t('Total number of copies')}
              rewardQuantityPerCopy={t('Reward Quantity per Copy')}
              unpurchasedNode={t('UNPURCHASED EQUITY')}
              claimText={'CLAIM'}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
