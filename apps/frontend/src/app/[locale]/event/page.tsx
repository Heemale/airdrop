import NavBar from '@/components/NavBar';
import Image from 'next/image';
import * as React from 'react';
import Button from '@/components/Button';

const Home = () => {
  return (
    <>
      <NavBar />
      <div className="flex flex-col gap-24 sm:gap-64 my-4 sm:my-5 mx-6">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="flex flex-col gap-8 sm:gap-20">
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-10">
              <div className="w-[339px] sm:w-[720px]">
                <Image
                  src="/mceclip0.jpg"
                  width="720"
                  height="360"
                  alt="mceclip0"
                />
              </div>
              <div className="bg-gradient-to-b from-[#010101] to-[#222] flex flex-col gap-4 border border-gray-600 rounded-2xl sm:rounded-3xl px-6 pt-6 pb-8 text-white">
                <div className="flex gap-4 items-center">
                  <Image
                    src="/announcement.svg"
                    width="20"
                    height="20"
                    alt="announcement"
                  />
                  <div className="">Event Announcements :</div>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <div>Mystery Box Rules</div>
                  <div>BNB Airdrop Preview</div>
                  <div>CoralApp & Skyark | TenJin NFT Airdrop Event Ann...</div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="text-center">
                <div className="text-white text-xl font-bold">
                  Ongoing Airdrops
                </div>
                <div className="w-1/2 h-1 bg-gradient-to-r from-[#ffbdad] to-[#e7534f] mx-auto mt-2 rounded-3xl"></div>
              </div>
              <Button text="All Airdrops" />
            </div>
            <div className="flex flex-col">
              <div className="bg-gradient-to-b from-[#010101] to-[#222] flex flex-col gap-4 sm:gap-6 border border-gray-600 rounded-3xl px-6 py-8 text-white">
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <div className="w-[50px] sm:w-[70px]">
                      <Image
                        src="/bnb-bnb-logo.svg"
                        width="70"
                        height="70"
                        alt="bnb-bnb-logo"
                      />
                    </div>
                    <div className="flex flex-col justify-between">
                      <div className="text-2xl font-semibold">BNB ROUND #3</div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div>2024-11-05 12:00 UTC</div>
                        <div>~</div>
                        <div>2024-11-08 12:00 UTC</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>Chain</div>
                  <div className="flex justify-between items-center gap-2">
                    <Image
                      src="/bnb-bnb-logo.svg"
                      width="24"
                      height="24"
                      alt="bnb-bnb-logo"
                    />
                    <div>BEP20</div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>Total Copies</div>
                  <div>9,367</div>
                </div>
                <div className="flex justify-between">
                  <div>Reward Quantity per Copy</div>
                  <div>168 BNB</div>
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
