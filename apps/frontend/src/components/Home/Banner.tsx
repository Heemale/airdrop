import * as React from 'react';
import BannerTitle from '@/components/Home/BannerTitle';
import BannerDescription from '@/components/Home/BannerDescription';
import Binance from '@/components/Home/Binance';
import BannerBottom from '@/components/Home/BannerBottom';
import Image from 'next/image';

interface Props {
  locale: string;
}

const Banner = (props: Props) => {
  const { locale } = props;

  return (
    <div className="flex flex-col-reverse sm:flex-row justify-between mx-5 sm:mx-10 mt-10 sm:mt-24 gap-6">
      <div className="flex flex-col gap-6 sm:gap-12">
        <BannerTitle locale={locale} />
        <BannerDescription locale={locale} />
        <Binance />
        <BannerBottom />
      </div>
      <Image
        src="/home_banner.gif"
        width="600"
        height="600"
        alt="home_banner"
      />
    </div>
  );
};

export default Banner;
