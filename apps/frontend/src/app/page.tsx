import NavBar from '@/components/NavBar';
import Image from 'next/image';
import * as React from 'react';

const Home = () => {
  return (
    <div className="bg-[url('/home_banner_bg.png')] bg-center bg-no-repeat bg-cover bg-fixed">
      <NavBar />
      <div className="flex flex-col gap-64 mb-10">
        <div className="flex justify-between mx-10 mt-24">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-2 text-white text-6xl font-semibold">
              <div>Unlock Exclusive</div>
              <div>Rewards with</div>
              <div>CoralPhone</div>
            </div>
            <div className="flex flex-col gap-1 text-white text-lg">
              <div>
                CoralPhone maximizes your advantages through a series of
                exclusive rewards
              </div>
              <div>
                designed to enhance your Web3 experience. From airdrops to
                passive income,
              </div>
              <div>
                CoralPhone users can enjoy unique benefits tailored to promote
                the Web3 lifestyle.
              </div>
            </div>
            <Image
              src="/home_binance.gif"
              width="384"
              height="111"
              alt="home_binance"
            />
            <div className="flex items-center gap-10">
              <div className="text-white font-semibold">———</div>
              <Image
                src="/home_banner_bottom.png"
                width="64"
                height="64"
                alt="home_banner_bottom"
              />
            </div>
          </div>
          <Image
            src="/home_banner.png"
            width="600"
            height="600"
            alt="home_banner"
          />
        </div>
        <div className="flex flex-col gap-10 items-center">
          <div className="flex flex-col gap-14 items-center">
            <div className="text-white text-6xl font-semibold">
              Cumulative sales worldwide
            </div>
            <div className="flex gap-8 text-white text-9xl font-bold italic">
              <div className="flex flex-col justify-between w-[144px] gap-1 relative">
                <div className="bg-gray-400 border-white rounded-t-3xl h-[93px]"></div>
                <div className="bg-gray-400 border-white rounded-b-3xl h-[93px]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  6
                </div>
              </div>
              <div className="flex flex-col justify-between w-[144px] gap-1 relative">
                <div className="bg-gray-400 border-white rounded-t-3xl h-[93px]"></div>
                <div className="bg-gray-400 border-white rounded-b-3xl h-[93px]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  0
                </div>
              </div>
              <div className="flex flex-col justify-between w-[144px] gap-1 relative">
                <div className="bg-gray-400 border-white rounded-t-3xl h-[93px]"></div>
                <div className="bg-gray-400 border-white rounded-b-3xl h-[93px]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  0
                </div>
              </div>
              <div className="flex flex-col justify-between w-[144px] gap-1 relative">
                <div className="bg-gray-400 border-white rounded-t-3xl h-[93px]"></div>
                <div className="bg-gray-400 border-white rounded-b-3xl h-[93px]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  0
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <div className="text-white text-2xl font-medium">
                Data update:
              </div>
              <div className="text-white text-2xl">September 10, 24:00 UTC</div>
            </div>
            <div className="flex gap-2 border-white border rounded-2xl px-10 py-2">
              <div className="text-white text-3xl font-semibold">
                Alwaysround
              </div>
              <div className="text-white text-3xl font-semibold">1</div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="flex flex-col items-center gap-10">
              <div className="text-white text-2xl border-white border rounded-2xl px-12 py-4">
                Quantity of units remaining for the current round
              </div>
              <div className="flex gap-4 text-white text-9xl font-bold italic">
                <div className="flex justify-center border-white border rounded-2xl w-[110px] h-[158px]">
                  -
                </div>
                <div className="flex justify-center border-white border rounded-2xl w-[110px] h-[158px]">
                  -
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-10">
              <div className="text-white text-2xl border-white border rounded-2xl px-12 py-4">
                Quantity sold during the current round
              </div>
              <div className="flex gap-4 text-white text-9xl font-bold italic">
                <div className="flex justify-center border-white border rounded-2xl w-[110px] h-[158px]">
                  -
                </div>
                <div className="flex justify-center border-white border rounded-2xl w-[110px] h-[158px]">
                  -
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
