'use client';
import React, { useEffect, useState } from 'react';
import { useClientTranslation } from '@/hook';
import { formatAddress } from '@mysten/sui/utils';
import { message } from 'antd';
import { handleDevTxError, handleTxError } from '@/sdk/error';
import { formatTimestamp, sleep } from '@/utils/time';
import { getBuyNodeRecord } from '@/api';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { convertSmallToLarge, subtract, toFixed } from '@/utils/math';
import type { BuyNodeRecord } from '@/api/types/response';

export interface History {
  rank: bigint;
  nodeNum: bigint;
  amount: bigint;
  time: bigint;
}

const PurchaseHistory = () => {
  const account = useCurrentAccount();

  const { t } = useClientTranslation();
  const [purchaseHistory, setPurchaseHistory] = useState<Array<BuyNodeRecord>>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number | null>(null); // 分页游标
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPurchaseHistory = async (sender: string | null = null,
    cursor: number | null = null,) => {
    if (!hasMore || loading) return;

    if (account?.address) {
      setLoading(true);
      try {
        const response = await getBuyNodeRecord({
          sender: account?.address!,
          nextCursor: cursor!,
        });
        const newBuy = response.data || [];

          setTimeout(() => {
            // 使用 Set 去重
            const existingIds = new Set(purchaseHistory.map(item => item.id));
            const uniqueNewData = newBuy.filter(
              (item: BuyNodeRecord) => !existingIds.has(item.id)
            );
            
            setPurchaseHistory(prev => [...prev, ...uniqueNewData]);
            setCursor(response.nextCursor);
            setHasMore(response.nextCursor !== null && uniqueNewData.length > 0);
            setLoading(false);
          }, 1000);
        
      } catch (e: any) {
        console.log(`Failed to fetch purchase history: ${e.message}`);
        messageApi.error(`${t(handleTxError(e.message))}`);
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchPurchaseHistory(account?.address, null);
  }, [account]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight ===
      e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom && !loading && cursor && hasMore) {
      fetchPurchaseHistory(account?.address,cursor);
    }
   
  };

  return (
    <div className="p-4">
      {/* 标题部分 */}
      <div className="flex items-center gap-2 mb-3">
        <img src="/personal04.png" alt="" className="w-6 h-6" />{' '}
        {/* 地球图标 */}
        <span className="text-white text-xl">
          {t('Equity purchase record')}
        </span>
      </div>
      {/* 表格部分 */}
      <div className="w-full overflow-x-auto max-h-[400px]" onScroll={handleScroll}>
        <div className="min-w-[600px] lg:w-full">
          <table className="w-full table-auto bg-transparent">
            <thead className="sticky text-white top-0 bg-[url('/personal01.png')] bg-cover bg-center">
              <tr>
                <th className="px-4 py-2 text-left whitespace-nowrap w-1/4">{t('Equity number')}</th>
                <th className="px-4 py-2 text-left whitespace-nowrap w-1/4">{t('Equity level')}</th>
                <th className="px-4 py-2 text-left whitespace-nowrap w-1/4">{t('Amount')}</th>
                <th className="px-4 py-2 text-left whitespace-nowrap w-1/4">{t('Time')}</th>
              </tr>
            </thead>
            <tbody className="bg-[rgba(13,24,41,0.7)] text-white">
              {loading && (
                <tr>
                  <td colSpan={4} className="text-center whitespace-nowrap">
                    {t('loading...')}
                  </td>
                </tr>
              )}
              {purchaseHistory.map((record, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap">{record.rank}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {record.nodeNum}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {convertSmallToLarge(Number(record.paymentAmount), 9)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {formatTimestamp(Number(record.timestamp) * 1000)}
                  </td>
                </tr>
              ))}
              {!loading && !hasMore && purchaseHistory.length > 0 && (
                <tr>
                  <td colSpan={4} className="text-center whitespace-nowrap py-2 text-gray-400">
                    {t('No more data')}
                  </td>
                </tr>
              )}
            </tbody>
            
          </table>
          
        </div>
      </div>

    </div>
  );
};

export default PurchaseHistory;
