import * as React from 'react';
import Image from 'next/image';

const About = () => {
  return (
    <div className="max-w-screen-xl flex flex-col lg:flex-row items-center gap-10 px-4 text-white">
      <div className="flex-1 about-info">
        <h2 className="text-6xl font-bold text-gradient">About CoralApp</h2>
        <p className="mt-5 text-lg leading-relaxed">
          CoralApp is a pioneering mobile ecosystem for multi-chain environments
          which was admitted into Binance Labs Incubation. CoralApp recently
          launched its first Web3 phone, the CoralApp. CoralApp features a
          revolutionary Coral OS + Mobile Stack, which optimizes Android OS and
          smart devices from the ground up, creating a smoother entry point to
          Web3 and strengthening the mobile infrastructure of the blockchain
          industry.
        </p>
      </div>
      <div className="relative w-60 sm:w-96 about-img">
        <Image
          src="/home_banner2.gif" // 请替换为实际的图片路径
          alt="CoralApp Phone"
          width={320}
          height={640}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default About;
