'use client';

import React, { useEffect, useState } from 'react';
import { useClientTranslation } from '@/hook';
import { formatAddress } from '@mysten/sui/utils';
import { handleDevTxError, handleTxError } from '@/sdk/error';
import { message } from 'antd';

interface BindSummary {
  id: string;
  address: string;
  sharers: bigint;
  teams: bigint;
  teamTotalInvest: bigint;
}

const BindAddressList = () => {
  const { t } = useClientTranslation();
  const [binds, setBinds] = useState<BindSummary[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [cursor, setCursor] = useState<string | null>(null); // 分页游标

  // 模拟的数据
  const simulatedData: BindSummary[] = [
    {
      id: '1',
      address: '0x1234567890abcdef',
      sharers: BigInt(100),
      teams: BigInt(10),
      teamTotalInvest: BigInt(5000),
    },
    {
      id: '2',
      address: '0xabcdef1234567890',
      sharers: BigInt(200),
      teams: BigInt(20),
      teamTotalInvest: BigInt(10000),
    },
    {
      id: '3',
      address: '0xabcdefabcdef1234',
      sharers: BigInt(150),
      teams: BigInt(15),
      teamTotalInvest: BigInt(7500),
    },
    {
      id: '4',
      address: '0xabcdefabcdef1234',
      sharers: BigInt(150),
      teams: BigInt(15),
      teamTotalInvest: BigInt(7500),
    },
    {
      id: '5',
      address: '0xabcdefabcdef1234',
      sharers: BigInt(150),
      teams: BigInt(15),
      teamTotalInvest: BigInt(7500),
    },
    // 可以继续添加更多的模拟数据
  ];

  // 模拟获取绑定数据
  const fetchBinds = async (cursor: string | null = null) => {
    setLoading(true);
    try {
      // 模拟延迟加载数据
      setTimeout(() => {
        setBinds((prevBinds) => [...prevBinds, ...simulatedData]); // 拼接新数据
        setTotalCount(50); // 模拟总数
        setCursor('nextCursor'); // 模拟下一个分页游标
      }, 1000);
   
  } catch (e: any) {
    console.log(`Failed to load binding address: ${e.message}`);
    messageApi.error(`${t(handleTxError(e.message))}`);
  }
  };

  // 在组件加载时获取绑定数据
  useEffect(() => {
    fetchBinds();
  }, []);

  // 滚动加载更多
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom && !loading && cursor) {
      fetchBinds(cursor); // 滚动到底部时加载更多数据
    }
  };

  return (
    <div className="p-4">
      {/* 大标题 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src="/personal04.png" alt="" className="w-6 h-6" />
          <span className="text-white text-xl">{t('My share')}</span>
        </div>
      </div>
      <div className="p-4 rounded-lg mb-4 sticky top-0 z-10">
  <div className="grid grid-cols-4 gap-4">
    <div className="text-white text-sm font-bold justify-self-start">{t('Address')}</div>
    <div className="text-white text-sm font-bold justify-self-end col-span-3">{t('Sharers / Teams / Team total investment')}</div>
  </div>
</div>

      {/* 表格容器 */}
      <div className="bg-[rgba(13,24,41,0.8)] rounded-lg p-4 max-h-[400px] overflow-y-auto" onScroll={handleScroll}>
        {/* 加载中状态 */}
        {loading && <div className="text-white">{t('loading...')}</div>}
    

        {!loading && binds && (
          <div className="space-y-4">
            {binds.map((bind) => (
  <div key={bind.id} className="bg-[rgba(13,24,41,0.7)] p-4 rounded-lg">
    <div className="grid grid-cols-4 gap-4">
    <div className="text-white text-sm truncate">{formatAddress(bind.address)}</div>
    <div className="text-white text-sm truncate justify-self-end align-self-start col-span-4">
        {bind.sharers.toString()} / {bind.teams.toString()} / {bind.teamTotalInvest.toString()}
      </div>
    </div>
  </div>
))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BindAddressList;
