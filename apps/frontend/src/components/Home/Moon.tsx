import * as React from 'react';
import Image from 'next/image';

const Moon = () => {
  return (
    <div className="w-[200px] sm:w-[384px]">
      <Image
        src="/home_moon.png"
        width="150"
        height="150"
        alt="home_binance"
      />
    </div>
  );
};

export default Moon;
