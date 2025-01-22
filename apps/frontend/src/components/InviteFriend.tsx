'use client';

import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from 'antd';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useClientTranslation } from '@/hook';

const InviteFriend = () => {
  const account = useCurrentAccount();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useClientTranslation();
  const generateInviteLink = () => {
    if (account?.address) {
      return `${window.location.origin}?inviter=${account.address}`;
    } else {
      return '';
    }
  };

  const handleCopy = () => {
    messageApi.success(t('Copy Success'));
  };

  return (
    <>
      {contextHolder}
      {account?.address ? (
        <CopyToClipboard text={generateInviteLink()} onCopy={handleCopy}>
          <div className="text-white cursor-pointer">{t('Invite friends')}</div>
        </CopyToClipboard>
      ) : (
        <div className="text-gray-500 cursor-not-allowed">
          {t('Invite friends')}
        </div>
      )}
    </>
  );
};

export default InviteFriend;
