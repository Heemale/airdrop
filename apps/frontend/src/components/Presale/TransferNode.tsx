'use client';

import * as React from 'react';
import { nodeClient,simulationTransaction, } from '@/sdk';
import { NODES } from '@local/airdrop-sdk/utils';
import { useClientTranslation } from '@/hook';
import { handleTxError } from '@/sdk/error';

import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { useContext, useState } from 'react';
import { message } from 'antd';
import { PresaleContext } from '@/context/PresaleContext';

interface Props {
  transferText: string;
  connectText: string;
  placeholderText: string;
}

const TransferNode = (props: Props) => {
  const { transferText, connectText, placeholderText } = props;
  const { t } = useClientTranslation();

  const account = useCurrentAccount();
  const { node } = useContext(PresaleContext);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [loading, setLoading] = React.useState(false);
  const [receiver, setReceiver] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReceiver(event.target.value);
  };

  const transferNode = async () => {
    try {
      if (account && account.address && receiver) {
        setLoading(true);
        const tx = await nodeClient.transfer(NODES, receiver);
        await simulationTransaction(tx, account.address);

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
              messageApi.error(`Error: ${t(handleTxError(message))}`);
              setLoading(false);
            },
          },
        );
      } else {
        messageApi.warning('Please enter a valid receiver address.');
      }
    } catch (e: any) {
      console.log(`TransferNode: ${e.message}`);
      messageApi.error(`Error:${t(handleTxError(e.message))}`);
      setLoading(false);
    }
  };

  return (
    <div className="col-span-2">
      {account && node && (
        <>
          <input
            type="text"
            value={receiver}
            onChange={handleInputChange}
            placeholder={placeholderText}
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
            onClick={transferNode}
          >
            {transferText}
          </button>
        </>
      )}
      {contextHolder}
    </div>
  );
};

export default TransferNode;
