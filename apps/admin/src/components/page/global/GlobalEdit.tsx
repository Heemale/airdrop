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
import { globalClient, devTransaction } from '@/sdk';
import { GLOBAL } from '@/sdk/constants';
import { handleDevTxError } from '@/sdk/error';
import { useNotify } from 'react-admin';
import { Transaction } from '@mysten/sui/transactions';

const PostEditToolbar = (props: any) => (
  <Toolbar {...props}>
    <SaveButton label="修改" />
  </Toolbar>
);

const GlobalEdit = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();

  const onSubmit = async (data: any) => {
    if (!account) return;

    try {
      const tx = new Transaction();

      globalClient.modify(tx, GLOBAL, data.object, data.ivValid);

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
    <Edit>
      <SimpleForm onSubmit={onSubmit} toolbar={<PostEditToolbar />}>
        <TextInput source="id" label="ID" disabled fullWidth />
        <TextInput source="object" label="对象ID" fullWidth />
        <BooleanInput source="isOpen" label="是否开启" fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default GlobalEdit;
