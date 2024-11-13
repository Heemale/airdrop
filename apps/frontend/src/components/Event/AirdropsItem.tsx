import Image from 'next/image';
import * as React from 'react';

interface Props {
  translate: any;
  data: {
    id: number | bigint | string;
  };
}

const AirdropsItem = (props: Props) => {
  const { data } = props;
  const { id } = data;
  const { translate: t } = props;
  return (
    <div className="bg-gradient-to-b from-[#010101] to-[#222] flex flex-col gap-4 sm:gap-6 border border-gray-600 rounded-3xl px-3 sm:px-6 py-8 text-white">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="w-[50px] sm:w-[70px]">
            <Image
              src="/bnb-bnb-logo.svg"
              width="70"
              height="70"
              alt="bnb-bnb-logo"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex gap-2">
              <div className="text-xl font-semibold">
                BNB ROUND #{id ? id : '-'}
              </div>
              <div className="bg-gradient-to-b from-[#3f6b47] to-[#093f13] rounded px-1 py-0.5">
                ongoing
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div>2024-11-05 12:00 UTC</div>
              <div>~</div>
              <div>2024-11-08 12:00 UTC</div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative inline-block bg-[#f0b90b] text-black font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer">
        {t('Claim')}
      </div>
      <div className="flex justify-between">
        <div>{t('Chain')}</div>
        <div className="flex justify-between items-center gap-2">
          <Image
            src="/bnb-bnb-logo.svg"
            width="24"
            height="24"
            alt="bnb-bnb-logo"
          />
          <div>BEP20</div>
        </div>
      </div>
      <div className="flex justify-between">
        <div>{t('Total Copies')}</div>
        <div>9,367</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Reward Quantity per Copy')}</div>
        <div>168 BNB</div>
      </div>
    </div>
  );
};

export default AirdropsItem;
