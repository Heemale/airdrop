import NumberPlate from '@/components/Home/NumberPlate';
import UpdateData from '@/components/Home/UpdateData';
import Always from '@/components/Home/Always';
import * as React from 'react';

const Sale = () => {
  return (
    <div className="flex flex-col gap-4 sm:gap-14 items-center mt-16 sm:mt-32">
      <div className="text-gradient text-xl sm:text-6xl font-semibold">
        Cumulative sales worldwide
      </div>
      <div className="flex gap-1 sm:gap-8 text-white text-3xl sm:text-9xl font-bold italic">
        <NumberPlate num={6} />
        <NumberPlate num={0} />
        <NumberPlate num={0} />
        <NumberPlate num={0} />
      </div>
      <UpdateData />
      <Always />
    </div>
  );
};

export default Sale;
