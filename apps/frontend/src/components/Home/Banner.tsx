'use client';
import * as React from 'react';
import BannerTitle from '@/components/Home/BannerTitle';
import BannerDescription from '@/components/Home/BannerDescription';
import Moon from '@/components/Home/Moon';
import BannerBottom from '@/components/Home/BannerBottom';
import NavBarWrapper from '@/components/NavBarWrapper';


const Banner = () => {
  return (
    <div className="bg-[url('/home_banner_bg.jpg')] bg-contain bg-no-repeat sm:bg-cover bg-right flex flex-col gap-6 sm:gap-12 mb-48 sm:mb-0 sm:h-[900px]">
      <NavBarWrapper />
      <div className="flex flex-col gap-6 sm:gap-12 mx-4 sm:mx-16">
        <BannerTitle />
        <BannerDescription  />
        <Moon />
        <div className="flex gap-4 sm:gap-10">
          <BannerBottom />
        </div>
      </div>
    </div>
  );
};

export default Banner;
