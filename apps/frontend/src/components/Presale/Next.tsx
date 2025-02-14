'use client';

import Link from 'next/link';
import Button from '@/components/Button';
import * as React from 'react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { useContext, useEffect, useState } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import { inviteClient, nodeClient, devTransaction } from '@/sdk';
import { INVITE, NODES } from '@/sdk/constants';
import { InviteDialogContext } from '@/context/InviteDialogContext';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { message } from 'antd';
import { PresaleContext } from '@/context/PresaleContext';
import { useClientTranslation } from '@/hook';
import { handleDevTxError, handleTxError } from '@/sdk/error';
import { NodeStatus } from '@local/airdrop-sdk/node';

const Next = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { node } = useContext(PresaleContext);
  const { inviter, setInviter, setOpen } = useContext(InviteDialogContext);
  const { t } = useClientTranslation();

  const [receiver, setReceiver] = useState('');
  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isAlreadyBuyNode, setIsAlreadyBuyNode] =  useState<NodeStatus>(
    NodeStatus.NODE_NOT_OWNED,
  );

  const bind = () => {
    setOpen(true);
  };

  const getIsAlreadyBuyNode = async () => {
    if (account && account.address) {
      try {
        const user = account.address;
        const isAlreadyBuyNode = await nodeClient.getNodeStatus(NODES, user);
        setIsAlreadyBuyNode(isAlreadyBuyNode ? 1 : 0);
      } catch (e: any) {
        console.log(`getIsAlreadyBuyNode: ${e.message}`);
        messageApi.error(`${t(handleTxError(e.message))}`);
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
        messageApi.error(`${t(handleTxError(e.message))}`);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiver(event.target.value);
  };

  const transferNode = async () => {
    try {
      if (account && account.address && receiver) {
        setLoading(true);
        const tx = await nodeClient.transfer(NODES, receiver);

        try {
          await devTransaction(tx, account.address);
        } catch (e: any) {
          messageApi.error(`${t(handleDevTxError(e.message.trim()))}`);
          setLoading(false);
          return;
        }

        signAndExecuteTransaction(
          {
            transaction: tx,
          },
          {
            onSuccess: (result) => {
              console.log({ digest: result.digest });
              messageApi.success(`Success: ${result.digest}`);
              setLoading(false);
              setReceiver(''); // 清空接收人输入框
            },
            onError: ({ message }) => {
              console.log(`TransferNode: ${message}`);
              messageApi.error(`${t(handleTxError(message.trim()))}`);
              setLoading(false);
            },
          },
        );
      } else {
        messageApi.warning(t('Please enter a valid receiver address.'));
      }
    } catch (e: any) {
      console.log(`TransferNode: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message.trim()))}`);
      setLoading(false);
    }
  };

  const nextButton = () => {
    // 没有连接钱包，显示【连接钱包按钮】
    if (account) {
      // 未获取到数据，默认是置灰的【下一步按钮】
      if (inviter) {
        // 没有绑定邀请人，显示【绑定邀请人按钮】
        if (inviter === normalizeSuiAddress('0x0')) {
          return (
            <Button
              className="text-white w-full"
              text={'BIND INVITER'}
              onClick={bind}
            />
          );
        } else {
          if (node) {
            // 未购买节点，显示【下一步按钮】
            if (isAlreadyBuyNode === 0) {
              return (
                <Link href={'/presale-confirm'}>
                  <Button className="text-white w-full" text={t('NEXT')} />
                </Link>
              );
            }
            // 已购买节点，显示置灰的【已购买按钮】和转让的ui
            if (isAlreadyBuyNode === 1) {
              return (
                <>
                  <button
                    className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
                    disabled
                  >
                    {t('PURCHASED EQUITY')}
                  </button>
                  <input
                    type="text"
                    value={receiver}
                    onChange={handleInputChange}
                    placeholder={t('Please enter the node recipient')}
                    className="text-black w-full my-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button
                    className="text-white w-full"
                    text={t('TRANSFER EQUITY')}
                    onClick={transferNode}
                  />
                </>
              );
            }
          }
        }
      }

      return (
        <button
          className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
          disabled
        >
          {t('NEXT')}
        </button>
      );
    } else {
      return <ConnectWallet />;
    }
  };

  useEffect(() => {
    updateInvite();
    getIsAlreadyBuyNode();
  }, [account]);

  return (
    <div>
      {nextButton()}
      {contextHolder}
    </div>
  );
};

export default Next;
