'use client';

import React from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useClientTranslation } from '@/hook';


  

const Share = () => {
  const account = useCurrentAccount();
  const { t } = useClientTranslation();


  const generateInviteLink = () => {
    if (account?.address) {
      return account.address;
    }
    return '';
  };

  return (
    <div className="p-4">
      {/* 标题部分 */}
      <div className="flex items-center gap-2 mb-3">
        <img src="/personal04.png" alt="" className="w-6 h-6" /> {/* 添加地球图标 */}
        <span className="text-white text-xl">{t('Share with friends')}</span>
      </div>
      
      {/* 地址展示框 - 使用深蓝色背景 */}
      <div className="bg-[rgba(13,24,41,0.8)] rounded-lg p-4">
        <div className="text-gray-300 break-all">
          {generateInviteLink() || <>{t('Please connect your wallet')}</>}
        </div>
      </div>
    </div>
  );
};

export default Share;