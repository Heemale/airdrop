import {
  BooleanInput,
  Edit,
  NumberInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar as RaToolbar,
} from 'react-admin';
import React from 'react';
import { LIMITS, ADMIN_CAP } from '@/sdk/constants';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { airdropClient, devTransaction } from '@/sdk';
import { handleDevTxError } from '@/sdk/error';
import { useNotify } from 'react-admin';
import CreateEditActions from '@/components/ui/CreateEditActions';

const Toolbar = (props: any) => (
  <RaToolbar {...props}>
    <SaveButton label="修改" />
  </RaToolbar>
);

const LimitEdit = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();

  const onSubmit = async (data: any) => {
    if (!account) return;

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
            notify(`提交成功, 交易hash: ${result.digest}`, { type: 'success' });
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
    <Edit actions={<CreateEditActions />}>
      <SimpleForm onSubmit={onSubmit} toolbar={<Toolbar />}>
        <TextInput source="id" label="ID" disabled fullWidth />
        <TextInput source="address" label="用户地址" fullWidth />
        <NumberInput source="times" label="可领取次数" fullWidth />
        <BooleanInput source="ivValid" label="是否限制" fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default LimitEdit;
