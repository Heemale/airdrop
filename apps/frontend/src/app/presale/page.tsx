import NavBar from '@/components/NavBar';
import Image from 'next/image';
import * as React from 'react';
import { Button } from '@mui/material';

const Home = () => {
  return (
    <div className="bg-black bg-center bg-no-repeat bg-cover bg-fixed">
      <NavBar />
      <div className="flex flex-col gap-12 mx-10 mt-32">
        <div className="flex flex-col gap-8">
          <div className="text-white text-6xl font-semibold">Buy Nodes</div>
          <div className="text-gray-400 font-semibold">
            Public sale starts on September 21, 09:00 PM
          </div>
        </div>
        <div className="flex justify-between mx-10">
          <div>
            <Image
              src="/sonic-hyperfuse.png"
              width="800"
              height="450"
              alt="sonic-hyperfuse"
            />
          </div>
          <div className="flex flex-col justify-center gap-4 text-white w-[456px]">
            <div className="text-3xl">Node Info</div>
            <div className="flex justify-between">
              <div>Node Name</div>
              <div>HyperFuse Guardian Node</div>
            </div>
            <div className="flex justify-between">
              <div>Current Tier</div>
              <div>11</div>
            </div>
            <div className="flex justify-between">
              <div>Remaining/Total Nodes</div>
              <div>625/2033</div>
            </div>
            <div className="flex justify-between">
              <div>Allowed Purchase Amount</div>
              <div>0</div>
            </div>
            <div className="flex justify-between">
              <div>Node Price</div>
              <div>1Node = 303 USDC</div>
            </div>
            <Button variant="contained">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
