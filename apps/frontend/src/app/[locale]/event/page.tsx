import NavBar from '@/components/NavBar';
import Image from 'next/image';
import * as React from 'react';
import Announcement from '@/ui/Announcement';
import BnbLogo from '@/ui/BnbLogo';
import Button from '@/components/Button';

const Home = () => {
  return (
    <div className="bg-black bg-center bg-no-repeat bg-cover bg-fixed">
      <NavBar />
      <div className="flex flex-col gap-12 mx-10 my-32">
        <div className="flex gap-10">
          <Image src="/mceclip0.jpg" width="720" height="360" alt="mceclip0" />
          <div className="flex flex-col gap-4 border border-gray-600 rounded-3xl px-6 py-8 text-white">
            <div className="flex gap-4 items-center">
              <Announcement width={20} height={20} />
              <div className="">Event Announcements :</div>
            </div>
            <div className="flex flex-col gap-4">
              <div>Mystery Box Rules</div>
              <div>BNB Airdrop Preview</div>
              <div>CoralApp & Skyark | TenJin NFT Airdrop Event Ann...</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-center">
            <div className="text-white text-xl font-bold">Ongoing Airdrops</div>
            <div className="w-1/2 h-1 bg-red-500 mx-auto mt-2 rounded-3xl"></div>
          </div>
          <Button text="All Airdrops" />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col gap-4 border border-gray-600 rounded-3xl px-6 py-8 text-white">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <BnbLogo width={56} height={56} />
                <div className="flex flex-col justify-between">
                  <div>BNB ROUND #3</div>
                  <div className="flex gap-2">
                    <div>2024-11-05 12:00 UTC</div>
                    <div>~</div>
                    <div>2024-11-08 12:00 UTC</div>
                  </div>
                </div>
              </div>
              <div>Not connected</div>
            </div>
            <div className="flex justify-between">
              <div>Chain</div>
              <div className="flex justify-between items-center gap-2">
                <BnbLogo width={24} height={24} />
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
  );
};

export default Home;
