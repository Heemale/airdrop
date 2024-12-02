import * as React from 'react';
import Remain from '@/components/Home/Remain';
import Banner from '@/components/Home/Banner';
import Sale from '@/components/Home/Sale';
import About from '@/components/Home/About';
import Holder from '@/components/Home/Holder';

interface Props {
  params: Promise<{ locale: string }>;
}

const Home = async (props: Props) => {
  const { params } = props;
  const { locale } = await params;

  return (
    <>
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
    </>
  );
};

export default Home;
