'use client';

import * as React from 'react';
import Button from '@/components/Button';
import { nodeClient } from '@/sdk';
import { NODES } from '@local/airdrop-sdk/utils';

import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { useState } from 'react';
import { message } from 'antd';


interface Props {
  transferText: string;
  connectText: string;
  placeholderText: string;
}


const TransferNode = (props: Props) => {
  const { transferText, connectText, placeholderText } = props;

  const account = useCurrentAccount();
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
              messageApi.error(`Error: ${message}`);
              setLoading(false);
            },
          },
        );
      } else {
        messageApi.warning('Please enter a valid receiver address.');
      }
    } catch (e: any) {
      console.log(`TransferNode: ${e.message}`);
      messageApi.error(`Error: ${e.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="col-span-2">
      {account ? (
        <>
          <input
            type="text"
            value={receiver}
            onChange={handleInputChange}
            placeholder={placeholderText}
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            className="text-white w-full"
            text={transferText}
            onClick={transferNode}
          />
        </>
      ) : (
        <div className="text-center">
          <Button className="text-white w-full" text={connectText} />
        </div>
      )}
      
      {contextHolder}
    </div>
  );
};

export default TransferNode;
