import NavBar from '@/components/NavBar';
import * as React from 'react';
import Banner from '@/components/Event/Banner';
import Announcement from '@/components/Event/Announcement';
import AirdropsHeader from '@/components/Event/AirdropsHeader';
import AirdropsList from '@/components/Event/AirdropsList';

const Home = () => {
  return (
    <>
      <NavBar />
      <div className="flex flex-col gap-24 sm:gap-64 my-4 sm:my-5 mx-6">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="flex flex-col gap-8 sm:gap-20 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-10">
              <Banner />
              <Announcement />
            </div>
            <AirdropsHeader />
            <AirdropsList />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
