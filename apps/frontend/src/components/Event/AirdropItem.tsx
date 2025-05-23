'use client';

import Image from 'next/image';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { airdropClient, devTransaction, nodeClient } from '@/sdk';
import { AIRDROPS, GLOBAL, INVEST, LIMITS, NODES } from '@/sdk/constants';
import { SUI_CLOCK_OBJECT_ID } from '@mysten/sui/utils';
import type { AirdropInfo, TokenMetadata } from '@/api/types/response';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { message } from 'antd';
import { getCoinTypeName } from '@/utils';
import { formatTimestamp, sleep } from '@/utils/time';
import { convertSmallToLarge, divide } from '@/utils/math';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useClientTranslation } from '@/hook';
import { handleDevTxError, handleTxError } from '@/sdk/error';
import { useRouter } from 'next/navigation';
import { NodeStatus } from '@local/airdrop-sdk/node';
import Link from 'next/link';

export interface Props {
  data: AirdropInfo;
  isOngoing?: boolean;
  ongoingText: string;
  chainText: string;
  totalCopies: string;
  rewardQuantityPerCopy: string;
  nodeStatus: NodeStatus | null;
  claimText: string;
}

const AirdropItem = (props: Props) => {
  const {
    data,
    isOngoing,
    ongoingText,
    chainText,
    totalCopies,
    nodeStatus,
    claimText,
  } = props;

  const { t } = useClientTranslation();
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const [remainingClaimTimes, setRemainingClaimTimes] = useState<bigint>(
    BigInt(0),
  );
  const [loading, setLoading] = useState<boolean>(false);

  const claim = async () => {
    if (!account) return;

    try {
      setLoading(true);

      const tx = airdropClient.claimV2(
        data.airdrop.coinType,
        AIRDROPS,
        NODES,
        data.airdrop.round,
        SUI_CLOCK_OBJECT_ID,
        LIMITS,
        INVEST,
        GLOBAL,
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
      const times = await nodeClient.remainingQuantityOfClaimV2(
        NODES,
        account.address,
        data.airdrop.round,
        LIMITS,
      );
      setRemainingClaimTimes(BigInt(times));
    } catch (e: any) {
      console.log(`fetch remainingQuantityOfClaim error: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message))}`);
    }
  };

  const coinImage = (token: TokenMetadata) => {
    if (!token.iconUrl) return '/favicon.ico';
    if (token.iconUrl) {
      return token.iconUrl;
    } else {
      if (token.iconUrl && token.symbol === 'SUI') {
        return '/sui-sui-logo.png';
      }
    }

    return '/favicon.ico';
  };

  const claimButton = () => {
    // 如果空投结束，置灰
    // 如果权益状态未获取，置灰
    if (!isOngoing || nodeStatus === null) {
      return (
        <button
          className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
          disabled
        >
          {t(claimText)}
        </button>
      );
    }

    if (nodeStatus === NodeStatus.NODE_NOT_OWNED) {
      return (
        <Link href={'/presale'}>
          <button
            className={`w-full relative inline-block bg-[#f0b90b] text-black font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer`}
          >
            {t('PLEASE PURCHASE RIGHTS')}
          </button>
        </Link>
      );
    }

    if (nodeStatus === NodeStatus.NODE_DISABLED) {
      return (
        <Link href={'/presale'}>
          <button
            className={`w-full relative inline-block bg-[#f0b90b] text-black font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer`}
          >
            {t('PLEASE REACTIVATE RIGHTS')}
          </button>
        </Link>
      );
    }

    if (
      nodeStatus === NodeStatus.NODE_ACTIVE &&
      remainingClaimTimes > BigInt(0)
    ) {
      return (
        <button
          onClick={claim}
          className={`relative inline-block bg-[#f0b90b] text-black font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer`}
        >
          {t(claimText)}
        </button>
      );
    }

    return (
      <button
        className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
        disabled
      >
        {t(claimText)}
      </button>
    );
  };

  useEffect(() => {
    remainingQuantityOfClaim();
  }, [data]);

  return (
    <div className="bg-gradient-to-b from-[#010101] to-[#222] flex flex-col gap-4 sm:gap-6 border border-gray-600 rounded-3xl px-3 sm:px-6 py-8 text-white">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="w-[50px] sm:w-[70px]">
            <Image
              src={coinImage(data.airdrop.token!)}
              width="70"
              height="70"
              alt="coin-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/sui-sui-logo.png';
              }}
            />
          </div>
          <div className="flex flex-col justify-between gap-2">
            <div className="flex gap-2">
              <div className="text-lg font-semibold">
                {getCoinTypeName(data.airdrop.coinType)} - ROUND{' '}
                {data.airdrop.round.toString()}
              </div>
              {isOngoing && (
                <div>
                  <div
                    className="bg-gradient-to-b from-[#3f6b47] to-[#093f13] rounded px-1 py-0.5 
                whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                  >
                    {ongoingText}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div>
                {formatTimestamp(Number(data.airdrop.startTime) * 1000)}
              </div>
              <div>{formatTimestamp(Number(data.airdrop.endTime) * 1000)}</div>
            </div>
          </div>
        </div>
      </div>
      <div>{data.airdrop.description}</div>
      {claimButton()}
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
        <div>{data.airdrop.totalShares.toString()}</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Number of copies remaining')}</div>
        <div>
          {(data.airdrop.totalShares - data.airdrop.claimedShares).toString()}
        </div>
      </div>
      <div className="flex justify-between">
        <div>{t('Number of copies available')}</div>
        <div>{remainingClaimTimes.toString()}</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Reward Quantity per Copy')}</div>
        <div>
          {data.airdrop.token
            ? convertSmallToLarge(
                divide(
                  data.airdrop.totalBalance.toString(),
                  data.airdrop.totalShares.toString(),
                ),
                data.airdrop.token.decimals.toString(),
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
