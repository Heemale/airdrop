import * as React from 'react';
import BannerTitle from '@/components/Home/BannerTitle';
import BannerDescription from '@/components/Home/BannerDescription';
import Moon from '@/components/Home/Moon';
import BannerBottom from '@/components/Home/BannerBottom';
import Image from 'next/image';

interface Props {
  locale: string;
}

const Banner = (props: Props) => {
  const { locale } = props;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:flex-row justify-between mx-5 sm:mx-10 mt-10 sm:mt-24 gap-6">
      <div className="flex flex-col gap-6 sm:gap-12">
        <BannerTitle />
        <BannerDescription locale={locale} />
        <Moon />
        <BannerBottom />
      </div>
      {/*<Image*/}
      {/*  src="/home_banner.gif"*/}
      {/*  width="600"*/}
      {/*  height="600"*/}
      {/*  alt="home_banner"*/}
      {/*/>*/}
    </div>
  );
};

export default Banner;
