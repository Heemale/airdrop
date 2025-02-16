'use client';

import React, { useEffect, useState } from 'react';
import { useClientTranslation } from '@/hook';
import { formatAddress } from '@mysten/sui/utils';
import { handleTxError } from '@/sdk/error';
import { message } from 'antd';
import { getUserShares } from '@/api';
import { useCurrentAccount } from '@mysten/dapp-kit';
import type { UserSharesResponse } from '@/api/types/response';
const BindAddressList = () => {
  const account = useCurrentAccount();

  const { t } = useClientTranslation();
  const [binds, setBinds] = useState<UserSharesResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [cursor, setCursor] = useState<number | null>(null); // 分页游标
  const [hasMore, setHasMore] = useState<boolean>(true);

  // 模拟获取绑定数据
  const fetchBinds = async (cursor: number | null = null) => {
    if (!hasMore || loading) return; // 防止重复加载

    if (account?.address) {
      try {
        setLoading(true);
        const response = await getUserShares({
          sender: account?.address!,
          nextCursor: cursor!,
        });

        if (response?.data) {
          setTimeout(() => {
            // 使用 Set 去重
            const existingIds = new Set(binds.map((item) => item.id));
            const uniqueNewData = response.data.filter(
              (item) => !existingIds.has(item.id),
            );

            setBinds((prev) => [...prev, ...uniqueNewData]);
            setCursor(response.nextCursor);
            setHasMore(
              response.nextCursor !== null && uniqueNewData.length > 0,
            );
            setLoading(false);
          }, 1000);
        } else {
          message.error(t('无法获取用户信息'));
        }
      } catch (e: any) {
        console.log(`Failed to load binding address: ${e.message}`);
        messageApi.error(`${t(handleTxError(e.message))}`);
      }
    }
  };

  // 在组件加载时获取绑定数据
  useEffect(() => {
    fetchBinds();
  }, [account]);

  // 滚动加载更多
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // 当滚动到距离底部10px以内时，认为到达底部
    const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isBottom && !loading && cursor) {
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
        <div className="flex justify-between">
          <div className="text-white text-xs sm:text-sm font-bold justify-self-start">
            {t('Address')}
          </div>
          <div className="text-white text-xs sm:text-sm font-bold justify-self-end">
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
                className="bg-[rgba(13,24,41,0.7)] py-2 sm:p-4 rounded-lg"
              >
                <div className="flex justify-between">
                  <div className="text-white text-l truncate">
                    {formatAddress(bind.address)}
                  </div>
                  <div className="text-white text-l truncate justify-self-end align-self-start">
                    {bind.shares.toString()} / {bind.teams.toString()} /
                    {bind.teamTotalInvestment
                      ? bind.teamTotalInvestment.toString()
                      : 0}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !hasMore && binds.length > 0 && (
          <div className="text-center text-gray-400 py-2">
            {t('No more data')}
          </div>
        )}
      </div>
    </div>
  );
};

export default BindAddressList;
