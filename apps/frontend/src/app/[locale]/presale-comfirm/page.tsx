import NavBar from '@/components/NavBar';
import Image from 'next/image';
import * as React from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="bg-black bg-center bg-no-repeat bg-cover bg-fixed">
      <NavBar />
      <div className="flex flex-col gap-12 mx-10 my-32">
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
            <div className="text-3xl">Purchase Order</div>
            <div className="flex justify-between">
              <div>Allowed Purchase Amount</div>
              <div>649</div>
            </div>
            <div className="flex justify-between">
              <div>Quantity</div>
              <div>1</div>
            </div>
            <div className="flex justify-between">
              <div>Estimated Cost</div>
              <div>272.7 USDT</div>
            </div>
            <div className="flex justify-between">
              <div>Price Detail：1 x 272.7 USDT</div>
            </div>
            <div className="flex justify-between">
              <div>Wallet Balance：19.409 USDT</div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <Link href="/presale">
                  <Button variant="contained" fullWidth>
                    Back
                  </Button>
                </Link>
              </div>
              <div className="col-span-2">
                <Button variant="contained" fullWidth>
                  Purchase
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
