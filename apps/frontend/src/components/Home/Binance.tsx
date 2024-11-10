import * as React from 'react';
import Image from 'next/image';

const Binance = () => {
  return (
    <div className="w-[200px] sm:w-[384px]">
      <Image
        src="/home_binance.gif"
        width="384"
        height="111"
        alt="home_binance"
      />
    </div>
  );
};

export default Binance;
