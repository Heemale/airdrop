'use client';
import NavBarWrapper from '@/components/NavBarWrapper';
import * as React from 'react';
import Banner from '@/components/Event/Banner';
import Announcement from '@/components/Event/Announcement';
import AirdropsHeader from '@/components/Event/AirdropsHeader';
import AirdropList from '@/components/Event/AirdropList';
import { useClientTranslation } from '@/hook';

const Home = async () => {
  const { t } = useClientTranslation();

  return (
    <>
      <NavBarWrapper />
      <div className="flex flex-col gap-24 sm:gap-64 my-4 sm:my-5 mx-6">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="flex flex-col gap-8 sm:gap-20 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-10">
              <Banner />
              <Announcement />
            </div>
            <AirdropsHeader />
            <AirdropList
              isOngoing
              ongoingText={t('ongoing')}
              chainText={t('Chain')}
              totalCopies={t('Total number of copies')}
              rewardQuantityPerCopy={t('Reward Quantity per Copy')}
              claimText={'CLAIM'}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
