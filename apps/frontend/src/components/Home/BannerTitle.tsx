'use client';
import * as React from 'react';
import Image from 'next/image';

const BannerTitle =  () => {
  return (
    <>
      <div className="hidden sm:flex sm:-ml-20">
        <Image
          src="/home_title1_zh.png"
          width="500"
          height="500"
          alt="home_binance"
        />
      </div>
      <div className="flex sm:hidden -ml-10">
        <Image
          src="/home_title1_zh.png"
          width="300"
          height="300"
          alt="home_binance"
        />
      </div>
    </>
  );
};

export default BannerTitle;
