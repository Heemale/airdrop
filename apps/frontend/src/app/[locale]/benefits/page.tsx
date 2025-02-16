import * as React from 'react';
import NavBarWrapper from '@/components/NavBarWrapper';
import MyAirdrops from '@/components/Event/MyAirdrops';
import AirdropTab from '@/components/Event/AirdropTab';

const Home = async () => {
  return (
    <>
      <NavBarWrapper />
      <div className="flex flex-col gap-24 sm:gap-64 my-4 sm:my-5 mx-6">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="w-full max-w-[1260px] flex flex-col gap-6 text-white">
            <AirdropTab />
            <MyAirdrops />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
