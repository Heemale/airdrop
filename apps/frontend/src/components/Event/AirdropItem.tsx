'use client';

import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';
import { airdropClient } from '@/sdk';
import { AIRDROPS, NODES } from '@local/airdrop-sdk/utils';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui/utils';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { message } from 'antd';
import { getCoinTypeName } from '@/utils';
import { formatTimestamp } from '@/utils/time';
import { divide } from '@/utils/math';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useClientTranslation } from '@/hook';

export interface Props {
  data: AirdropInfo;
  isOngoing?: boolean;
  ongoingText: string;
  chainText: string;
  totalCopies: string;
  rewardQuantityPerCopy: string;
  unpurchasedNode: string;
  isAlreadyBuyNode: boolean;
  claimText: string;
}

const AirdropItem = (props: Props) => {
  const {
    data,
    isOngoing,
    ongoingText,
    chainText,
    totalCopies,
    rewardQuantityPerCopy,
    unpurchasedNode,
    isAlreadyBuyNode,
    claimText,
  } = props;

  const { t } = useClientTranslation();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const claim = () => {
    setLoading(true);
    try {
      const res = airdropClient.claim(
        data.coinType,
        AIRDROPS,
        NODES,
        data.round,
        SUI_CLOCK_OBJECT_ID,
      );
      signAndExecuteTransaction(
        { transaction: res },
        {
          onSuccess: (result) => {
            console.log({ digest: result.digest });
            messageApi.info(`Success: ${result.digest}`);
            setLoading(false);
          },
          onError: ({ message }) => {
            console.log(`Claim: ${message}`);
            messageApi.error(`Error: ${message}`);
            setLoading(false);
          },
        },
      );
    } catch (e: any) {
      console.log(`Claim: ${e.message}`);
      messageApi.error(`Error: ${e.message}`);
      setLoading(false);
    }
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
              {isOngoing && (
                <div className="bg-gradient-to-b from-[#3f6b47] to-[#093f13] rounded px-1 py-0.5">
                  {ongoingText}
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div>{formatTimestamp(Number(data.startTime))}</div>
              <div>~</div>
              <div>{formatTimestamp(Number(data.endTime))}</div>
            </div>
          </div>
        </div>
      </div>
      <div>{data.description}</div>
      {isAlreadyBuyNode ? (
        <button
          onClick={claim}
          className={`relative inline-block bg-[#f0b90b] text-black font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer`}
        >
          {t(claimText)}
        </button>
      ) : (
        <button
          className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
          disabled
        >
          {unpurchasedNode}
        </button>
      )}

      <div className="flex justify-between">
        <div>{chainText}</div>
        <div className="flex justify-between items-center gap-2">
          <Image
            src="/bnb-bnb-logo.svg"
            width="24"
            height="24"
            alt="bnb-bnb-logo"
          />
          <div>{getCoinTypeName(data.coinType)}</div>
        </div>
      </div>
      <div className="flex justify-between">
        <div>{totalCopies}</div>
        <div>{data.totalShares}</div>
      </div>
      <div className="flex justify-between">
        <div>{rewardQuantityPerCopy}</div>
        <div>
          {divide(data.totalBalance.toString(), data.totalShares.toString())}
        </div>
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {contextHolder}
    </div>
  );
};

export default AirdropItem;
