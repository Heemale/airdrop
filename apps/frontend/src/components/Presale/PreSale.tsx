import BuyNodeTitle from '@/components/Presale/BuyNodeTitle';
import Image from 'next/image';
import * as React from 'react';

interface Props {
  locale: string;
  children: React.ReactNode;
}

const PreSale = (props: Props) => {
  const { locale, children } = props;

  return (
    <div className="flex flex-col gap-24 sm:gap-64 sm:my-5">
      <div className="flex flex-col gap-24 sm:gap-48 items-center">
        <div className="flex flex-col gap-8 sm:gap-20">
          <div className="flex flex-col sm:flex-row justify-between mx-10 sm:mt-48">
            <div className="w-[343px] sm:w-[800px]"></div>
            <div className="font-manrope flex flex-col justify-center gap-6 text-white sm:w-[456px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreSale;
