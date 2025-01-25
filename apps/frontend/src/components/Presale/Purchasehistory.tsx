'use client';

import React, { useEffect, useState } from 'react';
import { useClientTranslation } from '@/hook';
import { formatAddress } from '@mysten/sui/utils';
import { message } from 'antd';
import { handleDevTxError, handleTxError } from '@/sdk/error';
import { formatTimestamp, sleep } from '@/utils/time';

interface History {
  rank: bigint;
  nodeNum:bigint;
  amount: bigint;
  time: bigint;
}
const simulatedData: History[] = [
  {
    rank:BigInt(1),
    nodeNum:BigInt(2),  
     amount: BigInt(100),
    time: BigInt(5000),
  },
  {
    rank:BigInt(1),
    nodeNum:BigInt(2),  
    amount: BigInt(100),
    time: BigInt(5000),
  },
  {
    rank:BigInt(1),
    nodeNum:BigInt(2),      amount: BigInt(100),
    time: BigInt(5000),
  },
];

const Purchasehistory = () => {
  const { t } = useClientTranslation();
  const [purchaseHistory, setPurchaseHistory] = useState<History[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchPurchaseHistory = async () => {
    try {
      // 假设 getnode 方法是异步的，并返回一个包含购买记录的数组
      // const data = await inviteClient.getnode();
      setPurchaseHistory(simulatedData);
    } catch (e: any) {
      console.log(`Failed to fetch purchase history: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message))}`);
    }
  };

  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

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
                    <td className="px-4 py-2">
                      {record.rank}
                    </td>
                    <td className="px-4 py-2">
                      {record.nodeNum}
                    </td>
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
