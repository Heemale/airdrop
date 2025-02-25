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
import { convertLargeToSmall, convertSmallToLarge } from '@/utils/math';
import { TOKEN_DECIMAL } from '@/config';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { limitClient, devTransaction } from '@/sdk';
import { LIMITS } from '@/sdk/constants';
import { handleDevTxError } from '@/sdk/error';
import { useNotify } from 'react-admin';

const PostEditToolbar = (props: any) => (
  <Toolbar {...props}>
    <SaveButton label="修改" />
  </Toolbar>
);

const LimitEdit = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();

  const onSubmit = async (data: any) => {
    if (!account) return;

    try {
      const tx = limitClient.modify(
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
    <Edit>
      <SimpleForm onSubmit={onSubmit} toolbar={<PostEditToolbar />}>
        <TextInput source="id" label="ID" disabled fullWidth />
        <TextInput source="address" label="用户地址" fullWidth />
        <NumberInput source="times" label="可领取次数" fullWidth />
        <BooleanInput source="ivValid" label="是否限制" fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default LimitEdit;
