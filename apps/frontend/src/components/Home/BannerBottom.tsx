import * as React from 'react';
import Image from 'next/image';

const BannerBottom = () => {
  return (
    <div className="flex items-center gap-4 sm:gap-10 mt-10">
      <div className="hidden sm:flex text-white font-semibold">————</div>
      <div className="sm:hidden flex text-gray-400 font-semibold">————</div>
      <div className="hidden sm:flex">
        <Image
          src="/home_banner_bottom.png"
          width="64"
          height="64"
          alt="home_banner_bottom"
        />
      </div>
      <div className="sm:hidden flex">
        <Image
          src="/home_banner_bottom.png"
          width="24"
          height="24"
          alt="home_banner_bottom"
        />
      </div>
    </div>
  );
};

export default BannerBottom;
