'use client';

import React from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useClientTranslation } from '@/hook';
import { formatAddress } from '@mysten/sui/utils';
import InviteFriend from '@/components/InviteFriend';

const Share = () => {
  const account = useCurrentAccount();
  const { t } = useClientTranslation();

  const generateInviteLink = () => {
    if (account?.address) {
      // 生成完整的邀请链接
      return `${window.location.origin}?inviter=${formatAddress(account.address)}`;
    }
    return '';
  };

  return (
    <div className="p-4">
      {/* 标题部分 */}
      <div className="flex items-center gap-2 mb-3">
        <img src="/personal04.png" alt="" className="w-6 h-6" />{' '}
        {/* 添加地球图标 */}
        <span className="text-white text-xl">{t('Share with friends')}</span>
      </div>

      {/* 地址展示框 - 显示完整邀请链接 */}
      <div className="bg-[rgba(13,24,41,0.8)] rounded-lg p-4">
        <div className="text-gray-300 break-all">
          {generateInviteLink() || <>{t('Please connect your wallet')}</>}
        </div>
      </div>
      <div className="relative mt-4">
        {/* 内容层 - 深色半透明背景 */}
        <div className="relative w-full py-3 px-6 
          bg-[rgba(13,24,41,0.8)] 
          rounded-lg
          text-white font-bold 
          text-center text-lg 
          shadow-lg 
          transition-transform transform 
          active:scale-95 
          cursor-pointer
          hover:bg-[rgba(13,24,41,0.9)]
          border border-[#40cafd]"
        >
          <InviteFriend />
        </div>
      </div>
    </div>
  );
};

export default Share;
