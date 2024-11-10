import * as React from 'react';

interface Props {
  num: number | bigint | string;
}

const NumberPlate = (props: Props) => {
  const { num } = props;
  return (
    <div className="flex flex-col justify-between w-[40px] sm:w-[144px] gap-0.5 sm:gap-1 relative">
      <div className="bg-gradient-to-b from-[#010101] to-[#222] border-[#393838] border sm:border-2 rounded-t-xl sm:rounded-t-3xl h-[26px] sm:h-[93px]"></div>
      <div className="bg-gradient-to-b from-[#222] to-[#010101] border-[#393838] border sm:border-2 rounded-b-xl sm:rounded-b-3xl h-[26px] sm:h-[93px]"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        {num}
      </div>
    </div>
  );
};

export default NumberPlate;
