'use client';

import React, { useEffect, useState } from 'react';
import { useClientTranslation } from '@/hook';
import { formatAddress } from '@mysten/sui/utils';
import { handleDevTxError, handleTxError } from '@/sdk/error';
import { message } from 'antd';
import { getUserShares } from '@/api';
import { useCurrentAccount } from '@mysten/dapp-kit';
interface BindSummary {
  id: number;
  address: string;
  sharers: number;
  teams: number;
  teamTotalInvest: number;
}

const BindAddressList = () => {
    const account = useCurrentAccount();

  const { t } = useClientTranslation();
  const [binds, setBinds] = useState<BindSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [cursor, setCursor] = useState<number | null>(null); // 分页游标



  // 模拟获取绑定数据
  const fetchBinds = async (cursor: number | null = null) => {
    setLoading(true);
    try {
      const response = await getUserShares({sender: account?.address!,nextCursor: cursor!})
      console.log(1111111, response.data);
      const { data } = response; // 后端返回的数据和下一个游标
      const formattedData: BindSummary[] = data.map((item: any) => ({
        id: item.id && !isNaN(Number(item.id)) ? Number(item.id) : 0,
        address: item.address || '',  // 默认值为空字符串
        sharers: item.sharers && !isNaN(Number(item.sharers)) ? Number(item.sharers) : 0,
        teams: item.teams && !isNaN(Number(item.teams)) ? Number(item.teams) : 0,
        teamTotalInvest: item.teamTotalInvest && !isNaN(Number(item.teamTotalInvest)) ? Number(item.teamTotalInvest) : 0,
      }));
      
      // 模拟延迟加载数据
      setTimeout(() => {
        setBinds((prevBinds) => [...prevBinds, ...formattedData]); // 拼接新数据
        setCursor(data.nextCursor); // 保存新的游标，便于下次请求
      }, 1000);
    } catch (e: any) {
      console.log(`Failed to load binding address: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message))}`);
    } finally {
      setLoading(false);
    }
  };

  // 在组件加载时获取绑定数据
  useEffect(() => {
    fetchBinds();
  }, []);

  // 滚动加载更多
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const bottom =
      e.currentTarget.scrollHeight ===
      e.currentTarget.scrollTop + e.currentTarget.clientHeight;
    if (bottom && !loading && cursor) {
      fetchBinds(cursor); // 滚动到底部时加载更多数据
    }
  };

  return (
    <div className="p-4">
      {/* 标题部分 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <img src="/personal04.png" alt="" className="w-6 h-6" />
          <span className="text-white text-xl">{t('My share')}</span>
        </div>
      </div>
      <div className="p-4 rounded-lg mb-4 sticky top-0 z-10">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-white text-sm font-bold justify-self-start">
            {t('Address')}
          </div>
          <div className="text-white text-sm font-bold justify-self-end col-span-3">
            {t('Sharers / Teams / Team total investment')}
          </div>
        </div>
      </div>

      <div
        className="bg-[rgba(13,24,41,0.8)] rounded-lg p-4 max-h-[400px] overflow-y-auto"
        onScroll={handleScroll}
      >
        {/* 加载中状态 */}
        {loading && <div className="text-white">{t('loading...')}</div>}
        {!loading && binds && (
          <div className="space-y-4">
            {binds.map((bind) => (
              <div
                key={bind.id}
                className="bg-[rgba(13,24,41,0.7)] p-4 rounded-lg"
              >
                <div className="grid  grid-cols-4 gap-4">
                  <div className="text-white text-l truncate">
                    {formatAddress(bind.address)}
                  </div>
                  <div className="text-white text-l truncate justify-self-end align-self-start col-span-4 mt-[-40px]">
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
