'use client';

import Image from 'next/image';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  airdropClient,
  getCoinMetaData,
  nodeClient,
  devTransaction,
} from '@/sdk';
import { AIRDROPS, NODES } from '@local/airdrop-sdk/utils';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui/utils';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { message } from 'antd';
import { getCoinTypeName, isHexString } from '@/utils';
import { formatTimestamp, sleep } from '@/utils/time';
import { convertSmallToLarge, divide } from '@/utils/math';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useClientTranslation } from '@/hook';
import { handleTxError, handleDevTxError } from '@/sdk/error';
import { useRouter } from 'next/navigation';
import type { CoinMetadata } from '@mysten/sui/client';

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
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const router = useRouter();

  const [remainingClaimTimes, setRemainingClaimTimes] = useState<bigint>(
    BigInt(0),
  );
  const [coinMetaData, setCoinMetaData] = useState<CoinMetadata | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const claim = async () => {
    if (!account) return;
    setLoading(true);
    try {
      const tx = airdropClient.claim(
        data.coinType,
        AIRDROPS,
        NODES,
        data.round,
        SUI_CLOCK_OBJECT_ID,
      );

      try {
        await devTransaction(tx, account.address);
      } catch (e: any) {
        messageApi.error(`${t(handleDevTxError(e.message.trim()))}`);
        setLoading(false);
        return;
      }

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            console.log({ digest: result.digest });
            messageApi.success(`Success: ${result.digest}`);
            setLoading(false);
            await sleep(2);
            router.refresh();
          },
          onError: ({ message }) => {
            console.log(`Claim: ${message}`);
            messageApi.error(`${t(handleTxError(message.trim()))}`);
            setLoading(false);
          },
        },
      );
    } catch (e: any) {
      console.log(`Claim: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message.trim()))}`);
      setLoading(false);
    }
  };

  const remainingQuantityOfClaim = async () => {
    if (!account) return;
    try {
      const times = await nodeClient.remainingQuantityOfClaim(
        NODES,
        account.address,
        data.round,
      );
      setRemainingClaimTimes(BigInt(times));
    } catch (e) {
      // @ts-ignore
      console.log(`fetch remainingQuantityOfClaim error: ${e.message}`);
    }
  };

  const fetchCoinMetaData = async () => {
    const coinType = isHexString(data.coinType)
      ? data.coinType
      : '0x' + data.coinType;
    // @ts-ignore
    const coinMetaData = await getCoinMetaData({
      coinType,
    });
    setCoinMetaData(coinMetaData);
  };

  const coinImage = () => {
    if (!coinMetaData) return '/favicon.ico';
    // @ts-ignore
    if (coinMetaData.iconUrl) {
      // @ts-ignore
      return coinMetaData.iconUrl;
    } else {
      // @ts-ignore
      if (coin && coin.symbol === 'SUI') {
        return '/sui-sui-logo.png';
      }
    }

    return '/favicon.ico';
  };

  useEffect(() => {
    remainingQuantityOfClaim();
    fetchCoinMetaData();
  }, [data]);

  return (
    <div className="bg-gradient-to-b from-[#010101] to-[#222] flex flex-col gap-4 sm:gap-6 border border-gray-600 rounded-3xl px-3 sm:px-6 py-8 text-white">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="w-[50px] sm:w-[70px]">
            <Image src={coinImage()} width="70" height="70" alt="coin-image" />
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex gap-2">
              <div className="text-lg font-semibold">
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
      {isAlreadyBuyNode && isOngoing && remainingClaimTimes > BigInt(0) ? (
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
          {t(claimText)}
        </button>
      )}
      <div className="flex justify-between">
        <div>{chainText}</div>
        <div className="flex justify-between items-center gap-2">
          <Image
            src="/sui-sui-logo.png"
            width="20"
            height="20"
            alt="sui-sui-logo"
          />
          <div>SUI</div>
        </div>
      </div>
      <div className="flex justify-between">
        <div>{totalCopies}</div>
        <div>{data.totalShares}</div>
      </div>
      <div className="flex justify-between">
        <div>剩余份数</div>
        <div>{data.totalShares - data.claimedShares}</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Number of copies available')}</div>
        <div>{remainingClaimTimes}</div>
      </div>
      <div className="flex justify-between">
        <div>{rewardQuantityPerCopy}</div>
        <div>
          {coinMetaData
            ? convertSmallToLarge(
                divide(
                  data.totalBalance.toString(),
                  data.totalShares.toString(),
                ),
                coinMetaData.decimals.toString(),
              )
            : '-'}
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
