'use client';
import { inviteClientV1, devTransaction } from '@/sdk';
import { INVITE } from '@local/airdrop-sdk/utils';
import React, { useEffect, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useClientTranslation } from '@/hook';
import { formatAddress } from '@mysten/sui/utils';

const Recommender = () => {
  const account = useCurrentAccount();
  const { t } = useClientTranslation();
  const [inviter, setInviter] = useState<string | null>(null); // State to hold inviter address

  // 获取inviter地址
  const getInviter = async () => {
    if (account) {
      try {
        const inviterAddress = await inviteClientV1.inviters(
          INVITE,
          account.address,
        );
        if (inviterAddress) {
          setInviter(inviterAddress);
        } else {
          setInviter(null); // No inviter found
        }
      } catch (error) {
        console.error('Failed to fetch inviter address:', error);
        setInviter(null); // In case of error, set null
      }
    }
  };

  // 在组件加载时获取inviter
  useEffect(() => {
    if (account) {
      getInviter();
    }
  }, [account]);

  return (
    <div className="p-4">
      {/* 标题部分 */}
      <div className="flex items-center gap-2 mb-3">
        <img src="/personal04.png" alt="" className="w-6 h-6" />{' '}
        {/* 添加地球图标 */}
        <span className="text-white text-xl">{t('Recommender address')}</span>
      </div>

      {/* 地址展示框 - 使用深蓝色背景 */}
      <div className="bg-[rgba(13,24,41,0.8)] rounded-lg p-4">
        <div className="text-gray-300 break-all">
          {account ? (
            inviter ? (
              formatAddress(inviter)
            ) : (
              <div>{t('Please bind the inviter')}</div>
            )
          ) : (
            <>{t('Please connect your wallet')}</>
          )}{' '}
        </div>
      </div>
    </div>
  );
};

export default Recommender;
