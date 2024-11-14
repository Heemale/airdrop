import NavBar from '@/components/NavBar';
import * as React from 'react';
import initTranslations from '@/app/i18n';
import Remain from '@/components/Home/Remain';
import Banner from '@/components/Home/Banner';
import Sale from '@/components/Home/Sale';
import About from '@/components/Home/About';
import Holder from '@/components/Home/Holder';

const i18nNamespaces = ['common'];

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <>
      <NavBar />
      <div className="bg-[url('/home_banner_bg.png')] bg-center bg-no-repeat flex flex-col gap-24 sm:gap-64 my-5">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <Banner translate={t} />
        </div>
      </div>
      <div className="bg-[url('/home_bg4.png')] bg-center bg-no-repeat flex flex-col gap-24 sm:gap-64 my-5">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="flex flex-col gap-8 sm:gap-20">
            <Sale translate={t} />
            <Remain translate={t} />
            <About />
            <Holder />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
