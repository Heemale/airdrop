import React, { useEffect, useState } from 'react';
import { SimpleForm, TextInput, useNotify } from 'react-admin';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { airdropClient, devTransaction, nodeClient } from '@/sdk';
import { handleDevTxError } from '@/sdk/error';
import { NODES, ADMIN_CAP, PAY_COIN_TYPE } from '@/sdk/constants';
import { Typography, Card, Space } from 'antd';

const { Text } = Typography;

const ReceiverEdit = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();
  const [currentReceiver, setCurrentReceiver] = useState<string>('');

  const fetchReceiver = async () => {
    try {
      const receiver = await nodeClient.receiver(NODES);
      setCurrentReceiver(receiver);
    } catch (error: any) {
      notify(`获取接收人信息失败: ${error.message}`, { type: 'error' });
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReceiver();
  }, []);

  const onSubmit = async (data: any) => {
    if (!account) {
      notify('请先连接钱包', { type: 'error' });
      return;
    }

    if (!data?.address) {
      notify('请填写接收人地址', { type: 'error' });
      return;
    }

    try {
      const tx = airdropClient.modify_nodes(
        PAY_COIN_TYPE,
        ADMIN_CAP,
        NODES,
        data.address,
      );

      // 验证交易
      await devTransaction(tx, account.address);

      // 执行交易
      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: (result) => {
            notify(`修改成功, 交易hash: ${result.digest}`, { type: 'success' });
            // 更新显示
            fetchReceiver();
          },
          onError: ({ message }) => {
            notify(handleDevTxError(message.trim()), { type: 'error' });
          },
        },
      );
    } catch (e: any) {
      notify(handleDevTxError(e.message.trim()), { type: 'error' });
    }
  };

  return (
    <>
      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical">
          <Text>当前接收人地址: {currentReceiver || '加载中...'}</Text>
        </Space>
      </Card>
      <SimpleForm onSubmit={onSubmit}>
        <TextInput
          source="address"
          label="接收人地址"
          fullWidth
          helperText="请输入新的接收人地址"
        />
      </SimpleForm>
    </>
  );
};

export default ReceiverEdit;
