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
import { GLOBAL, INVITE, NODES } from '@/sdk/constants';
import { InviteDialogContext } from '@/context/InviteDialogContext';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { message } from 'antd';
import { PresaleContext } from '@/context/PresaleContext';
import { useClientTranslation } from '@/hook';
import { handleDevTxError, handleTxError } from '@/sdk/error';
import { NodeStatus } from '@local/airdrop-sdk/node';

// 测试数据
// const account = {
//   address:
//     '0x2ff7e1caaab6dbe36bf791ca3ece7dea7371cc2480bda6337754024b322fa985',
// };

const Next = () => {
  const { t } = useClientTranslation();
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { node } = useContext(PresaleContext);

  const { inviter, setInviter, setOpen } = useContext(InviteDialogContext);
  const [receiver, setReceiver] = useState('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [nodeStatus, setNodeStatus] = useState<NodeStatus | null>(null);

  const bind = () => {
    setOpen(true);
  };

  const getNodeStatus = async () => {
    if (!account) return;
    try {
      const nodeStatus = await nodeClient.getNodeStatus(NODES, account.address);
      setNodeStatus(nodeStatus);
    } catch (e: any) {
      console.log(`getNodeStatus: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message))}`);
    }
  };

  const updateInvite = async () => {
    if (!account) return;
    try {
      const inviter = await inviteClient.inviters(INVITE, account.address);
      setInviter(inviter);
    } catch (e: any) {
      console.log(`updateInvite: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message))}`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiver(event.target.value);
  };

  const transferNode = async () => {
    if (!account) return;
    if (!receiver) {
      messageApi.warning(t('Please enter a valid receiver address.'));
      return;
    }

    try {
      setLoading(true);
      const tx = await nodeClient.transferV2(NODES, receiver, GLOBAL);

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
            setReceiver('');
          },
          onError: ({ message }) => {
            console.log(`TransferNode: ${message}`);
            messageApi.error(`${t(handleTxError(message.trim()))}`);
            setLoading(false);
          },
        },
      );
    } catch (e: any) {
      console.log(`TransferNode: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message.trim()))}`);
      setLoading(false);
    }
  };

  const nextButton = () => {
    // 没有连接钱包，显示【连接钱包按钮】
    if (!account) {
      return <ConnectWallet />;
    }

    // 未获取到邀请人数据，显示置灰的【下一步按钮】
    // 如果没有获取权益数据，显示置灰的【下一步按钮】
    if (inviter === null || nodeStatus === null) {
      return (
        <button
          className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
          disabled
        >
          {t('NEXT')}
        </button>
      );
    }

    // 没有绑定邀请人，显示【绑定邀请人按钮】
    if (inviter === normalizeSuiAddress('0x0')) {
      return (
        <Button
          className="text-white w-full"
          text={'BIND INVITER'}
          onClick={bind}
        />
      );
    }

    // 如果已激活节点，显示置灰的【已购买按钮】和转让的ui
    if (nodeStatus === NodeStatus.NODE_ACTIVE) {
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

    // 需要购买（未拥有和禁用节点）且选择权益，显示【下一步按钮】
    if (
      (nodeStatus === NodeStatus.NODE_NOT_OWNED ||
        nodeStatus === NodeStatus.NODE_DISABLED) &&
      node
    ) {
      return (
        <Link href={'/presale-confirm'}>
          <Button className="text-white w-full" text={t('NEXT')} />
        </Link>
      );
    }

    return (
      <button
        className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
        disabled
      >
        {t('NEXT')}
      </button>
    );
  };

  useEffect(() => {
    updateInvite();
    getNodeStatus();
  }, [account]);

  return (
    <div>
      {nextButton()}
      {contextHolder}
    </div>
  );
};

export default Next;
