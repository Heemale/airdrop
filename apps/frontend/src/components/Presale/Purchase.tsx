'use client';

import * as React from 'react';
import Button from '@/components/Button';
import { inviteClient, nodeClient } from '@/sdk';
import { NODES, INVITE } from '@local/airdrop-sdk/utils';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { useContext, useEffect } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import { InviteDialogContext } from '@/context/InviteDialogContext';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { PresaleContext } from '@/context/PresaleContext';
import { message } from 'antd';

interface Props {
  buyText: string;
  connectText: string;
  bindText: string;
}

const coinType: string = '0x2::sui::SUI';

const Purchase = (props: Props) => {
  const { buyText, connectText, bindText } = props;

  const [messageApi, contextHolder] = message.useMessage();

  const account = useCurrentAccount();
  const { node } = useContext(PresaleContext);
  const { inviter, setOpen, setInviter } = useContext(InviteDialogContext);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const buyNode = async () => {
    try {
      if (node && account && account.address) {
        const tx = await nodeClient.buy(
          coinType,
          NODES,
          INVITE,
          node.rank,
          null,
          node.price,
          account.address,
        );
        signAndExecuteTransaction(
          {
            transaction: tx,
          },
          {
            onSuccess: (result) => {
              console.log({ digest: result.digest });
              messageApi.info(`Success: ${result.digest}`);
            },
            onError: ({ message }) => {
              console.log(`BuyNode: ${message}`);
              messageApi.error(`Error: ${message}`);
            },
          },
        );
      }
    } catch (e: any) {
      console.log(`BuyNode: ${e.message}`);
      messageApi.error(`Error: ${e.message}`);
    }
  };

  const bind = () => {
    setOpen(true);
  };

  const updateInvite = async () => {
    if (account && account.address) {
      // 查询邀请人和root
      const [inviter, root] = await Promise.all([
        inviteClient.inviters(INVITE, account.address),
        inviteClient.root(INVITE),
      ]);
      setInviter(inviter);
    }
  };

  useEffect(() => {
    updateInvite();
  }, [account]);

  return (
    <div className="col-span-2">
      {account ? (
        inviter === normalizeSuiAddress('0x0') ? (
          <Button
            className="text-white w-full"
            text={bindText}
            onClick={bind}
          />
        ) : (
          <Button
            className="text-white w-full"
            text={buyText}
            onClick={buyNode}
          />
        )
      ) : (
        <ConnectWallet text={connectText} />
      )}
      {contextHolder}
    </div>
  );
};

export default Purchase;
