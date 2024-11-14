import NavBar from '@/components/NavBar';
import * as React from 'react';
import Banner from '@/components/Event/Banner';
import Announcement from '@/components/Event/Announcement';
import AirdropsHeader from '@/components/Event/AirdropsHeader';
import AirdropsList from '@/components/Event/AirdropsList';
import initTranslations from '@/app/i18n';

const i18nNamespaces = ['common'];
const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <>
      <NavBar />
      <div className="flex flex-col gap-24 sm:gap-64 my-4 sm:my-5 mx-6">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="flex flex-col gap-8 sm:gap-20 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-10">
              <Banner />
              <Announcement translate={t} />
            </div>
            <AirdropsHeader translate={t} />
            <AirdropsList translate={t} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
