import * as React from 'react';

interface Props {
  num: number | bigint | string;
}

const NumberPlate2 = (props: Props) => {
  const { num } = props;
  return (
    <div className="flex flex-col justify-between w-[64px] sm:w-[110px] gap-0.5 relative">
      <div className="bg-gradient-to-b from-[#010101] to-[#222] border-gray-400 border-2 rounded-t-xl sm:rounded-t-3xl h-[40px] sm:h-[78px]"></div>
      <div className="bg-gradient-to-b from-[#222] to-[#010101] border-gray-400 border-2 rounded-b-xl sm:rounded-b-3xl h-[40px] sm:h-[78px]"></div>
      <div className="text-gradient absolute inset-0 flex justify-center">
        {num}
      </div>
    </div>
  );
};

export default NumberPlate2;
