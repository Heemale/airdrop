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

export interface History {
  rank: bigint;
  nodeNum: bigint;
  amount: bigint;
  time: bigint;
}

const PurchaseHistory = () => {
  const account = useCurrentAccount();

  const { t } = useClientTranslation();
  const [purchaseHistory, setPurchaseHistory] = useState<History[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number | null>(null); // 分页游标
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPurchaseHistory = async (cursor: number | null = null) => {
    if (account?.address) {
      try {
        setLoading(true);
        const response = await getBuyNodeRecord({
          sender: account?.address!,
          nextCursor: cursor!,
        });
        const { data } = response; // 后端返回的数据和下一个游标
        if (data) {
          const formattedData: History[] = data.map((item: any) => ({
            rank:
              item.rank && !isNaN(Number(item.rank))
                ? BigInt(item.rank)
                : BigInt(0),
            nodeNum:
              item.nodeNum && !isNaN(Number(item.nodeNum))
                ? BigInt(item.nodeNum)
                : BigInt(0),
            amount:
              item.paymentAmount && !isNaN(Number(item.paymentAmount))
                ? BigInt(item.paymentAmount)
                : BigInt(0),
            time:
              item.timestamp && !isNaN(Number(item.timestamp))
                ? BigInt(item.timestamp)
                : BigInt(0),
          }));
          setTimeout(() => {
            setPurchaseHistory((prev) => [...prev, ...formattedData]); // 拼接新数据
            setCursor(data.nextCursor); // 保存新的游标，便于下次请求
            setHasMore(data.nextCursor !== null && formattedData.length > 0);
          }, 1000);
        } else {
          message.error(t('Unable to obtain user information'));
        }
      } catch (e: any) {
        console.log(`Failed to fetch purchase history: ${e.message}`);
        messageApi.error(`${t(handleTxError(e.message))}`);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchPurchaseHistory();
  }, [account]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight ===
      e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom && !loading && cursor) {
      fetchPurchaseHistory(cursor); // 滚动到底部时加载更多数据
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
      <div
        className="overflow-x-auto max-h-[400px]"
        onScroll={handleScroll} // 将滚动监听器移到这里
      >
        <div className="relative">
          <table className="min-w-full table-auto bg-transparent">
            <thead className="sticky text-white top-0 bg-[url('/personal01.png')] bg-cover bg-center">
              <tr>
                <th className="px-4 py-2 text-left whitespace-nowrap">
                  {t('Equity number')}
                </th>
                <th className="px-4 py-2 text-left whitespace-nowrap">
                  {t('Equity level')}
                </th>
                <th className="px-4 py-2 text-left whitespace-nowrap">
                  {t('Amount')}
                </th>
                <th className="px-4 py-2 text-left whitespace-nowrap">
                  {t('Time')}
                </th>
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
              {purchaseHistory.length > 0 ? (
                purchaseHistory.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {record.rank}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {record.nodeNum}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {convertSmallToLarge(Number(record.amount), 9)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {formatTimestamp(Number(record.time) * 1000)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-4 py-2 text-center whitespace-nowrap"
                    colSpan={4}
                  >
                    {t('No records available')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!loading && !hasMore && purchaseHistory.length > 0 && (
            <div className="text-center text-gray-400 py-2">
              {t('No more data')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseHistory;
