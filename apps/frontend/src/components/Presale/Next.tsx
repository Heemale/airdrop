'use client';

import Link from 'next/link';
import Button from '@/components/Button';
import * as React from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useContext, useEffect, useState } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import { inviteClient, nodeClient } from '@/sdk';
import { INVITE, NODES } from '@local/airdrop-sdk/utils';
import { InviteDialogContext } from '@/context/InviteDialogContext';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { message } from 'antd';

interface Props {
  nextText: string;
  connectText: string;
  bindText: string;
  purchasedNodeText: string;
}

const Next = (props: Props) => {
  const { nextText, connectText, bindText, purchasedNodeText } = props;

  const account = useCurrentAccount();
  const { inviter, setInviter, setOpen } = useContext(InviteDialogContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [isAlreadyBuyNode, setIsAlreadyBuyNode] = useState<boolean>(false);

  const bind = () => {
    setOpen(true);
  };

  const getIsAlreadyBuyNode = async () => {
    if (account && account.address) {
      try {
        const user = account.address;
        const isAlreadyBuyNode = await nodeClient.isAlreadyBuyNode(NODES, user);
        setIsAlreadyBuyNode(isAlreadyBuyNode);
      } catch (e: any) {
        console.log(`getIsAlreadyBuyNode: ${e.message}`);
        messageApi.error(`Error: ${e.message}`);
      }
    }
  };

  const updateInvite = async () => {
    if (account && account.address) {
      try {
        const user = account.address;
        const inviter = await inviteClient.inviters(INVITE, user);
        setInviter(inviter);
      } catch (e: any) {
        console.log(`updateInvite: ${e.message}`);
        messageApi.error(`Error: ${e.message}`);
      }
    }
  };

  useEffect(() => {
    updateInvite();
    getIsAlreadyBuyNode();
  }, [account]);

  return (
    <div>
      {account ? (
        inviter === normalizeSuiAddress('0x0') ? (
          <Button
            className="text-white w-full"
            text={bindText}
            onClick={bind}
          />
        ) : (
          <Link href={'/presale-comfirm'}>
            {isAlreadyBuyNode ? (
              <button
                className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
                disabled
              >
                {purchasedNodeText}
              </button>
            ) : (
              <Button className="text-white w-full" text={nextText} />
            )}
          </Link>
        )
      ) : (
        <ConnectWallet text={connectText} />
      )}
      {contextHolder}
    </div>
  );
};

export default Next;
