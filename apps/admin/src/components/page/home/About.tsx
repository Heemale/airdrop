import * as React from 'react';
import BannerBottom from './BannerBottom';

const About = () => {
  return (
    <div className="bg-[url('/home_banner_bg2_2.png')] sm:bg-[url('/home_banner_bg2.jpg')] bg-contain bg-no-repeat sm:bg-cover bg-right flex flex-col gap-6 sm:gap-12 sm:mb-0 sm:h-[900px]">
      <div className="max-w-screen-xl flex flex-col lg:flex-row items-center gap-2 sm:gap-10 text-white h-[780px] mx-4 sm:mx-16">
        <div className="flex-1">
          <div className="mb-2 sm:mb-8">
            <div className="flex gap-4 justify-center sm:justify-start sm:gap-10 mb-4 sm:mb-0">
              <BannerBottom />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-2 items-center text-2xl sm:text-3xl font-bold text-gradient">
            <div>About Mercury World</div>
            <div className="hidden sm:flex">-</div>
            <div>Mercury World</div>
          </div>
          <div className="mt-10 text-sm sm:text-lg leading-relaxed sm:w-3/5">
            Mercury World is an equity aggregation platform built on the Sui
            blockchain. It links community organizations through the marketing
            jelly and analysis platform of the DAO community, and benefits from
            transparent information on the chain for recommendation records,
            reward distribution, and equity distribution, so as to expand the
            influence of the platform and allow more people to share the
            benefits of the Sui ecosystem.
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
