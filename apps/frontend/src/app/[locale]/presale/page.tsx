import NavBar from '@/components/NavBar';
import Image from 'next/image';
import * as React from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';

const Home = () => {
  return (
      <>
        <NavBar/>
        <div className="flex flex-col gap-24 sm:gap-64 my-5">
          <div className="flex flex-col gap-24 sm:gap-48 items-center">
            <div className="flex flex-col gap-8 sm:gap-20">
              <div className="flex flex-col gap-8 mt-10">
                <div className="font-orbitron text-white text-5xl font-semibold">Buy Nodes</div>
                <div className="font-orbitron text-gray-400 font-semibold">
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
                <div className="font-manrope flex flex-col justify-center gap-4 text-white w-[456px]">
                  <div className="font-orbitron text-2xl">Node Info</div>
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
                  <div>
                    <Link href={"/presale-comfirm"}>
                      <Button variant="contained" fullWidth>
                        Next
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default Home;
