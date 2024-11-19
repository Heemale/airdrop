'use client';
import Image from 'next/image';
import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';
import { useEffect, useState } from 'react';
import { airdropClient } from '@/sdk';
import { AIRDROPS, ADMIN_CAP, NODES } from '@local/airdrop-sdk/utils';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui/utils';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';

export interface Props {
  locale: string;
  data: AirdropInfo;
}

const AirdropItem = async (props: Props) => {
  const { data, locale } = props;
  const { round } = data;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);
  const [loading, setLoading] = useState<boolean>(true);
  const [claiming, setClaiming] = useState<boolean>(false);
  // 截取 coinType 名称
  const getCoinTypeName = (coinType: string): string => {
    const parts = coinType.split('::');
    return parts[parts.length - 1]; // 获取最后一部分
  };
  const handleClaim = async () => {
    setClaiming(true);
    const response = await airdropClient.claim(
      data.coinType,
      ADMIN_CAP,
      NODES,
      data.round,
      SUI_CLOCK_OBJECT_ID,
    );
    console.log('Claim success:', response);
  };

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
                {getCoinTypeName(data.coinType)} - ROUND {data.round}
              </div>
              <div className="bg-gradient-to-b from-[#3f6b47] to-[#093f13] rounded px-1 py-0.5">
                {data.isOpen}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div>{data.startTime}</div>
              <div>~</div>
              <div>{data.endTime}</div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleClaim}
        className={`relative inline-block bg-[#f0b90b] text-black font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer ${
          claiming ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={claiming}
      >
        {claiming ? t('Claiming...') : t('Claim')}
      </button>
      <div className="flex justify-between">
        <div>{data.coinType}</div>
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
        <div>{data.totalShares}</div>
        <div>9,367</div>
      </div>
      <div className="flex justify-between">
        <div>{data.description}</div>
        <div>aasd</div>
      </div>
      <div className="flex justify-between">
        <div>{data.totalBalance}</div>
        <div>168 BNB</div>
      </div>
    </div>
  );
};

export default AirdropItem;
