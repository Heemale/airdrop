'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { getCoinMetaData } from '@/sdk';
import { message } from 'antd';
import { getClaimAirdropRecord } from '@/api';
import { formatTimestamp } from '@/utils/time';
import Image from 'next/image';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { getCoinTypeName, isHexString } from '@/utils';
import { useClientTranslation } from '@/hook';
import type { CoinMetadata } from '@mysten/sui/client';
import { convertSmallToLarge } from '@/utils/math';
import type { ClaimAirdropRecord } from '@/api/types/response';

const MyAirdrops = () => {
  const account = useCurrentAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [airdropList, setAirdropList] = useState<Array<ClaimAirdropRecord>>([]);
  const [coinMetaDataMap, setCoinMetaDataMap] = useState<
    Record<string, CoinMetadata>
  >({});
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useClientTranslation();
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 获取 Coin 元数据
  const fetchCoinMetaData = async (coinType: string) => {
    try {
      const formattedCoinType = isHexString(coinType)
        ? coinType
        : '0x' + coinType;
      const metadata = await getCoinMetaData({
        coinType: formattedCoinType,
      });
      if (metadata) {
        setCoinMetaDataMap((prev) => ({
          ...prev,
          [coinType]: metadata,
        }));
      }
    } catch (error) {
      console.error(`Error fetching coin metadata for ${coinType}:`, error);
    }
  };

  // 获取空投信息
  const myAirdrops = async (
    sender: string | null = null,
    cursor: number | null = null,
  ) => {
    if (!hasMore || loading) return; // 防止重复加载
    try {
      const response = await getClaimAirdropRecord({
        sender: sender!,
        nextCursor: cursor!,
      });
      const newAirdrops = response.data || [];

      setTimeout(() => {
        // 使用 id 作为唯一键
        const existingIds = new Set(airdropList.map((item) => item.id));
        const uniqueNewAirdrops = newAirdrops.filter(
          (item: ClaimAirdropRecord) => !existingIds.has(item.id),
        );

        setAirdropList((prev) => [...prev, ...uniqueNewAirdrops]);
        setCursor(response.nextCursor);
        setHasMore(
          response.nextCursor !== null && uniqueNewAirdrops.length > 0,
        );
        setLoading(false);
      }, 1000);

      // 为每个新的空投获取代币元数据
      newAirdrops.forEach((airdrop: ClaimAirdropRecord) => {
        if (airdrop.coinType && !coinMetaDataMap[airdrop.coinType]) {
          fetchCoinMetaData(airdrop.coinType);
        }
      });
    } catch (e: any) {
      console.error(`Error fetching airdrops: ${e.message}`);
      messageApi.error(`Error: ${e.message}`);
      setLoading(false);
    }
  };

  const coinImage = (coinType: string) => {
    const metadata = coinMetaDataMap[coinType];
    if (metadata?.iconUrl) {
      return metadata.iconUrl;
    }
    // 如果是 SUI 代币
    if (coinType && getCoinTypeName(coinType) === 'SUI') {
      return '/sui-sui-logo.png';
    }
    return '/favicon.ico';
  };

  const formatAmount = (amount: string, coinType: string) => {
    const metadata = coinMetaDataMap[coinType];
    if (metadata?.decimals) {
      return convertSmallToLarge(amount, metadata.decimals.toString());
    }
    return amount;
  };

  useEffect(() => {
    if (account?.address) {
      myAirdrops(account.address, null); // 初始化请求
    }
  }, [account]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight ===
      e.currentTarget.scrollTop + e.currentTarget.clientHeight;

    if (bottom && !loading && cursor && hasMore) {
      myAirdrops(account?.address, cursor);
    }
  };

  return (
    <div
      className="bg-gradient-to-b from-[#010101] to-[#222] flex flex-col gap-4 sm:gap-6 border border-gray-600 rounded-3xl px-3 sm:px-6 py-8 text-white"
      onScroll={handleScroll}
      style={{ maxHeight: '600px', overflowY: 'auto' }}
    >
      <div className="flex flex-col gap-4">
        {loading && <div className="text-white">{t('loading...')}</div>}

        {airdropList.map((airdrop, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 w-full">
            <div className="flex items-center gap-4">
              <div className="w-[50px] sm:w-[70px] flex-shrink-0">
                <Image
                  src={coinImage(airdrop.coinType!)}
                  width={50}
                  height={50}
                  alt="coin-logo"
                />
              </div>
              <div className="flex-grow">
                <div className="text-lg font-semibold">
                  {getCoinTypeName(airdrop.coinType!)} - ROUND {airdrop.round}
                </div>
                <div className="text-gray-400">
                  {formatTimestamp(Number(airdrop.timestamp) * 1000)}
                </div>
                <div className="mt-2">
                  <span>{t('Receive copies')}: </span>
                  <span>
                    {formatAmount(
                      airdrop.amount?.toString() || '0',
                      airdrop.coinType!,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && !hasMore && airdropList.length > 0 && (
        <div className="text-center text-gray-400 py-2">{t('No more data')}</div>
      )}      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default MyAirdrops;
