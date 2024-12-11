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
import { INVITE, NODES } from '@local/airdrop-sdk/utils';
import { InviteDialogContext } from '@/context/InviteDialogContext';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { message } from 'antd';
import { PresaleContext } from '@/context/PresaleContext';
import { useClientTranslation } from '@/hook';
import { handleDevTxError, handleTxError } from '@/sdk/error';

interface Props {
  nextText: string;
  connectText: string;
  bindText: string;
  purchasedNodeText: string;
  transferText: string;
}

const Next = (props: Props) => {
  const { nextText, connectText, bindText, purchasedNodeText, transferText } =
    props;

  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { node } = useContext(PresaleContext);
  const { inviter, setInviter, setOpen } = useContext(InviteDialogContext);
  const { t } = useClientTranslation();

  const [receiver, setReceiver] = useState('');
  const [loading, setLoading] = React.useState(false);
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
        messageApi.error(`Error: ${t(handleTxError(e.message))}`);
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
        messageApi.error(`Error: ${t(handleTxError(e.message))}`);
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
              messageApi.info(`Success: ${result.digest}`);
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
        ) : isAlreadyBuyNode ? (
          <>
            <button
              className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
              disabled
            >
              {purchasedNodeText}
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
              text={transferText}
              onClick={transferNode}
            />
          </>
        ) : node ? (
          <Link href={'/presale-confirm'}>
            <Button className="text-white w-full" text={nextText} />
          </Link>
        ) : (
          <button
            className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
            disabled
          >
            {nextText}
          </button>
        )
      ) : (
        <ConnectWallet text={connectText} />
      )}
      {contextHolder}
    </div>
  );
};

export default Next;
