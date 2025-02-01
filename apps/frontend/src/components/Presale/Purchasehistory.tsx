'use client';
import React, { useEffect, useState } from 'react';
import { useClientTranslation } from '@/hook';
import { formatAddress } from '@mysten/sui/utils';
import { message } from 'antd';
import { handleDevTxError, handleTxError } from '@/sdk/error';
import { formatTimestamp, sleep } from '@/utils/time';
import { getBuyNodeRecord } from '@/api';
import { useCurrentAccount } from '@mysten/dapp-kit';

export interface History {
  rank: bigint;
  nodeNum: bigint;
  amount: bigint;
  time: bigint;
}

const Purchasehistory = () => {
  const account = useCurrentAccount();

  const { t } = useClientTranslation();
  const [purchaseHistory, setPurchaseHistory] = useState<History[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number | null>(null); // 分页游标

  const fetchPurchaseHistory = async (cursor: number | null = null) => {
    setLoading(true);
    try {
      const response = await getBuyNodeRecord({
        sender: account?.address!,
        nextCursor: cursor!,
      });
      console.log(1111111, response.data);
      // 假设 response.data 是一个数组，且结构与 History 接口一致
      const { data } = response; // 后端返回的数据和下一个游标
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
          item.time && !isNaN(Number(item.time))
            ? BigInt(item.time)
            : BigInt(0),
      }));
      setTimeout(() => {
      setPurchaseHistory((prev) => [...prev, ...formattedData]); // 拼接新数据
      setCursor(data.nextCursor); // 保存新的游标，便于下次请求
    }, 1000);

    } catch (e: any) {
      console.log(`Failed to fetch purchase history: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message))}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (account?.address) {
      fetchPurchaseHistory();
    }
  }, [account?.address]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight ===
      e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom && !loading && cursor !== null) {
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
      <div className="overflow-x-auto">
        <div className="relative">
          <table className="min-w-full table-auto bg-transparent">
            <thead className="sticky text-white top-0 bg-[url('/personal01.png')] bg-cover bg-center ">
              <tr>
                <th className="px-4 py-2 text-left">{t('Equity number')}</th>
                <th className="px-4 py-2 text-left">{t('Equity level')}</th>

                <th className="px-4 py-2 text-left">{t('Amount')}</th>
                <th className="px-4 py-2 text-left">{t('Time')}</th>
              </tr>
            </thead>
            <tbody
              className="bg-[rgba(13,24,41,0.7)] text-white rounded-lg p-4 max-h-[400px] overflow-y-auto "
              onScroll={handleScroll}
            >
              {/* 加载中状态 */}
              {loading && <div className="text-white">{t('loading...')}</div>}
              {purchaseHistory.length > 0 ? (
                purchaseHistory.map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{record.rank}</td>
                    <td className="px-4 py-2">{record.nodeNum}</td>
                    <td className="px-4 py-2">{record.amount}</td>
                    <td className="px-4 py-2">
                      {formatTimestamp(Number(record.time))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2 text-center" colSpan={3}>
                    {t('No records available')}
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

export default Purchasehistory;
