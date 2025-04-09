import React from 'react';
import { SimpleForm, TextInput, useNotify } from 'react-admin';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { airdropClient, devTransaction } from '@/sdk';
import { handleDevTxError } from '@/sdk/error';
import { NODES, ADMIN_CAP, PAY_COIN_TYPE } from '@/sdk/constants';

const ReceiverEdit = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();

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
    <SimpleForm onSubmit={onSubmit}>
      <TextInput
        source="address"
        label="接收人地址"
        fullWidth
        helperText="请输入新的接收人地址"
      />
    </SimpleForm>
  );
};

export default ReceiverEdit;
