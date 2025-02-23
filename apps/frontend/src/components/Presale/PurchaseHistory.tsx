'use client';
import React, { useEffect, useState } from 'react';
import { useClientTranslation } from '@/hook';
import { message } from 'antd';
import { handleTxError } from '@/sdk/error';
import { formatTimestamp } from '@/utils/time';
import { getBuyRecords } from '@/api';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { convertSmallToLarge } from '@/utils/math';
import type { BuyNodeRecord } from '@/api/types/response';

// 测试数据
// const account = {
//   address:
//     '0x2ff7e1caaab6dbe36bf791ca3ece7dea7371cc2480bda6337754024b322fa985',
// };

const PurchaseHistory = () => {
  const { t } = useClientTranslation();
  const account = useCurrentAccount();
  const [messageApi, contextHolder] = message.useMessage();

  const [purchaseHistory, setPurchaseHistory] = useState<Array<BuyNodeRecord>>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPurchaseHistory = async (cursor: number | null = null) => {
    if (!hasMore || loading) return;

    if (!account) return;

    try {
      setLoading(true);
      const response = await getBuyRecords(account?.address!, {
        nextCursor: cursor!,
      });
      const newBuy = response.data || [];

      setTimeout(() => {
        // 使用 Set 去重
        const existingIds = new Set(purchaseHistory.map((item) => item.id));
        const uniqueNewData = newBuy.filter(
          (item: BuyNodeRecord) => !existingIds.has(item.id),
        );

        setPurchaseHistory((prev) => [...prev, ...uniqueNewData]);
        setCursor(response.nextCursor);
        setHasMore(response.nextCursor !== null && uniqueNewData.length > 0);
        setLoading(false);
      }, 1000);
    } catch (e: any) {
      console.log(`Failed to fetch purchase history: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message))}`);
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // 当滚动到距离底部10px以内时，认为到达底部
    const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isBottom && !loading && cursor) {
      fetchPurchaseHistory(cursor);
    }
  };

  useEffect(() => {
    fetchPurchaseHistory(null);
  }, [account]);

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
        className="w-full overflow-x-auto max-h-[400px]"
        onScroll={handleScroll}
      >
        <div className="min-w-[600px] lg:w-full">
          <table className="w-full table-auto bg-transparent">
            <thead className="sticky text-white top-0 bg-[url('/personal01.png')] bg-cover bg-center">
              <tr>
                <th className="px-4 py-2 text-left whitespace-nowrap w-1/4">
                  {t('Equity level')}
                </th>
                <th className="px-4 py-2 text-left whitespace-nowrap w-1/4">
                  {t('Equity Name')}
                </th>
                <th className="px-4 py-2 text-left whitespace-nowrap w-1/4">
                  {t('Amount')}
                </th>
                <th className="px-4 py-2 text-left whitespace-nowrap w-1/4">
                  {t('Time')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-[rgba(13,24,41,0.7)] text-white">
              {purchaseHistory.map((record, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {record.node.description}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {record.node.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {convertSmallToLarge(Number(record.paymentAmount), 9)} sui
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {formatTimestamp(Number(record.timestamp) * 1000)}
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td colSpan={4} className="text-center whitespace-nowrap">
                    {t('loading...')}
                  </td>
                </tr>
              )}
              {!loading && !hasMore && purchaseHistory.length > 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center whitespace-nowrap py-2 text-gray-400"
                  >
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
