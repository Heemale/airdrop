import * as React from 'react';
import Image from 'next/image';

const Binance = () => {
  return (
    <>
      <div className="hidden sm:flex">
        <Image
          src="/home_binance.gif"
          width="384"
          height="111"
          alt="home_binance"
        />
      </div>
      <div className="sm:hidden flex">
        <Image
          src="/home_binance.gif"
          width="200"
          height="58"
          alt="home_binance"
        />
      </div>
    </>
  );
};

export default Binance;
