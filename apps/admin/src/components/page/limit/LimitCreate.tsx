import {
  BooleanInput,
  NumberInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar as RaToolbar,
  Create,
} from 'react-admin';
import React from 'react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { airdropClient, devTransaction } from '@/sdk';
import { LIMITS, ADMIN_CAP } from '@/sdk/constants';
import { handleDevTxError } from '@/sdk/error';
import { useNotify } from 'react-admin';
import CreateEditActions from '@/components/ui/CreateEditActions';

const Toolbar = (props: any) => (
  <RaToolbar {...props}>
    <SaveButton label="添加" />
  </RaToolbar>
);

const LimitCreate = () => {
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
    <Create actions={<CreateEditActions />}>
      <SimpleForm onSubmit={onSubmit} toolbar={<Toolbar />}>
        <TextInput source="address" label="用户地址" fullWidth />
        <NumberInput source="times" label="可领取次数" fullWidth />
        <BooleanInput source="ivValid" label="是否限制" fullWidth />
      </SimpleForm>
    </Create>
  );
};

export default LimitCreate;
