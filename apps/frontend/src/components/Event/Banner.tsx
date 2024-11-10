import Image from 'next/image';
import * as React from 'react';

const Banner = () => {
  return (
    <div className="w-[339px] sm:w-[720px]">
      <Image src="/mceclip0.jpg" width="720" height="360" alt="mceclip0" />
    </div>
  );
};

export default Banner;
