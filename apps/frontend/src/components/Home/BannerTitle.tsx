import * as React from 'react';
import Image from "next/image";

const BannerTitle = async () => {
  return (
      <div className="-ml-16 sm:-ml-20">
          <Image
              src="/home_title1_zh.png"
              width="500"
              height="500"
              alt="home_binance"
          />
      </div>
  );
};

export default BannerTitle;
