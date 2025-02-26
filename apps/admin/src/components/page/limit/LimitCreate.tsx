import {
  BooleanInput,
  Edit,
  NumberInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from 'react-admin';
import React from 'react';
import { Transaction } from '@mysten/sui/transactions';

import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { airdropClient, devTransaction } from '@/sdk';
import { LIMITS, ADMIN_CAP } from '@/sdk/constants';
import { handleDevTxError } from '@/sdk/error';
import { useNotify } from 'react-admin';

const CreateToolbar = (props: any) => (
  <Toolbar {...props}>
    <SaveButton label="添加" />
  </Toolbar>
);
const LimitCreate = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();

  const onSubmit = async (data: any) => {
    if (!account) return;
    console.log('提交的数据:', data);
    try {
      const tx = airdropClient.modifyLimits(
        ADMIN_CAP,
        LIMITS,
        data.address,
        data.times,
        data.ivValid,
      );

      try {
        await devTransaction(tx, account.address);
      } catch (e: any) {
        notify(handleDevTxError(e.message.trim()), { type: 'error' });
        return;
      }

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            notify(`提交成功, 交易hash: ${result.digest}`, { type: 'error' });
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
    <SimpleForm onSubmit={onSubmit} toolbar={<CreateToolbar />}>
      <TextInput source="address" label="用户地址" fullWidth />
      <NumberInput source="times" label="可领取次数" fullWidth />
      <BooleanInput source="ivValid" label="是否限制" fullWidth />
    </SimpleForm>
  );
};

export default LimitCreate;
