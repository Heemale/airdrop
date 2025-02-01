'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { ClaimSummary } from '@local/airdrop-sdk/airdrop';
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

const MyAirdrops = () => {
  const account = useCurrentAccount();
  const [loading, setLoading] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [airdropList, setAirdropList] = useState<Array<ClaimSummary>>([]);
  const [coinMetaDataMap, setCoinMetaDataMap] = useState<Record<string, any>>(
    {},
  );
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useClientTranslation();

  // 获取空投信息
  const myAirdrops = async (
    sender: string | null = null,
    cursor: number | null = null,
  ) => {
    setLoading(true);
    try {
      const response = await getClaimAirdropRecord({
        sender: sender!,
        nextCursor: cursor!,
      });
      const newAirdrops = response.data.list || [];
      setAirdropList((prev) => [...prev, ...newAirdrops]);
      setCursor(response.data.nextCursor || null);

      // 动态加载 coinType 元数据
      newAirdrops.forEach((airdrop: ClaimSummary) => {
        if (airdrop.coinType && !coinMetaDataMap[airdrop.coinType]) {
          fetchCoinMetaData(airdrop.coinType);
        }
      });
    } catch (e: any) {
      console.error(`Error fetching airdrops: ${e.message}`);
      messageApi.error(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 获取 Coin 元数据
  const fetchCoinMetaData = async (coinType: string) => {
    try {
      // 假设有 getCoinMetaData API 获取 coin 信息
      const coinMetaData = await getCoinMetaData({ coinType });
      setCoinMetaDataMap((prev) => ({
        ...prev,
        [coinType]: coinMetaData,
      }));
    } catch (error) {
      console.error(`Error fetching coin metadata for ${coinType}:`, error);
    }
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

    if (bottom && !loading && cursor) {
      myAirdrops(account?.address, cursor); // 滚动到底部时加载更多
    }
  };

  const coinImage = (coinType: string) => {
    const metaData = coinMetaDataMap[coinType];
    if (metaData?.iconUrl) {
      return metaData.iconUrl;
    }
    return '/favicon.ico';
  };

  return (
    <div
      className="bg-gradient-to-b from-[#010101] to-[#222] flex flex-col gap-4 sm:gap-6 border border-gray-600 rounded-3xl px-3 sm:px-6 py-8 text-white"
      onScroll={handleScroll}
      style={{ maxHeight: '600px', overflowY: 'auto' }}
    >
      <div className="flex justify-between">
        <div className="flex gap-2">
          {airdropList.length > 0 ? (
            airdropList.map((airdrop, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <div className="w-[50px] sm:w-[70px]">
                      <Image
                        src={coinImage(airdrop.coinType)}
                        width={50}
                        height={50}
                        alt="coin-logo"
                      />
                    </div>
                    <div>
                      <div className="flex flex-col justify-between">
                        <div className="flex gap-2">
                          <div className="text-lg font-semibold">
                            {getCoinTypeName(airdrop.coinType)} - ROUND{' '}
                            {airdrop.round}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div>
                              {formatTimestamp(Number(airdrop.timestamp))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>{t('Receive copies')}</div>
                      <div>{airdrop.amount || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">
              {t('No records available')}
            </div>
          )}
        </div>
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default MyAirdrops;
