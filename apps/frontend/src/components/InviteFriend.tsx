'use client';

import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { message } from 'antd';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface Props {
  inviteFriendText: string;
  copyText: string;
}

const InviteFriend = (props: Props) => {
  const { inviteFriendText, copyText } = props;

  const account = useCurrentAccount();
  const [messageApi, contextHolder] = message.useMessage();

  const generateInviteLink = () => {
    if (account?.address) {
      return `${window.location.origin}?inviter=${account.address}`;
    } else {
      return '';
    }
  };

  const handleCopy = () => {
    messageApi.success(copyText);
  };

  return (
    <>
      {contextHolder}
      {account?.address ? (
        <CopyToClipboard text={generateInviteLink()} onCopy={handleCopy}>
          <div className="text-gradient cursor-pointer">{inviteFriendText}</div>
        </CopyToClipboard>
      ) : (
        <div className="text-gray-500 cursor-not-allowed">
          {inviteFriendText}
        </div>
      )}
    </>
  );
};

export default InviteFriend;
