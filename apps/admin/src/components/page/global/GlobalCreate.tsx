import {
  BooleanInput,
  Edit,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from 'react-admin';
import React from 'react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

import { globalClient, devTransaction } from '@/sdk';
import { GLOBAL } from '@/sdk/constants';
import { handleDevTxError } from '@/sdk/error';
import { useNotify } from 'react-admin';

const CreateToolbar = (props: any) => (
  <Toolbar {...props}>
    <SaveButton label="添加" />
  </Toolbar>
);

const GlobalCreate = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();

  const onSubmit = async (data: any) => {
    if (!account) return;
    try {
      const tx = new Transaction();

      globalClient.modify(tx, GLOBAL, data.object, data.isValid);

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
      <TextInput source="object" label="对象ID" fullWidth />
      <BooleanInput source="isValid" label="是否合法" fullWidth />
    </SimpleForm>
  );
};

export default GlobalCreate;
