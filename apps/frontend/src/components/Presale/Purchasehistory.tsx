'use client'; 
import React, { useEffect, useState } from 'react';
import { useClientTranslation } from '@/hook';
import { formatAddress } from '@mysten/sui/utils';
import { message } from 'antd';
import { handleDevTxError, handleTxError } from '@/sdk/error';
import { formatTimestamp, sleep } from '@/utils/time';
import { getBuyInfo } from '@/api';
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

  const fetchPurchaseHistory = async () => {
    try {
      const response = await getBuyInfo(account?.address!);
      // 假设 response.data 是一个数组，且结构与 History 接口一致
      const formattedData: History[] = response.data.map((item: any) => ({
        rank: BigInt(item.rank),
        nodeNum: BigInt(item.nodeNum),
        amount: BigInt(item.paymentAmount),
        time: BigInt(item.timestamp),
      }));
      setPurchaseHistory(formattedData);
    } catch (e: any) {
      console.log(`Failed to fetch purchase history: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message))}`);
    }
  };
  useEffect(() => {
    if (account?.address) {
      fetchPurchaseHistory();
    }
  }, [account?.address]);

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
            <tbody className="bg-[rgba(13,24,41,0.7)] text-white ">
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
