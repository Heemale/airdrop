import Image from 'next/image';
import * as React from 'react';

const Announcement = () => {
  return (
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
  );
};

export default Announcement;
