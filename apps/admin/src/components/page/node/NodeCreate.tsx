import {
  Create,
  NumberInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar as RaToolbar,
  useNotify,
} from 'react-admin';
import React from 'react';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { airdropClient, devTransaction } from '@/sdk';
import { ADMIN_CAP, NODES } from '@/sdk/constants';
import { handleDevTxError } from '@/sdk/error';
import { Transaction } from '@mysten/sui/transactions';
import { convertLargeToSmall } from '@/utils/math';
import { TOKEN_DECIMAL } from '@/config';
import CreateEditActions from '@/components/ui/CreateEditActions';

const Toolbar = (props: any) => (
  <RaToolbar {...props}>
    <SaveButton label="添加" />
  </RaToolbar>
);

const NodeCreate = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();

  const onSubmit = async (data: any) => {
    if (!account) return;

    // 将字段转换为 BigInt
    const price = BigInt(convertLargeToSmall(data.price, TOKEN_DECIMAL));

    try {
      const tx = new Transaction();
      airdropClient.insertNode(
        tx,
        ADMIN_CAP,
        NODES,
        data.name,
        data.description,
        data.limit,
        price,
        data.totalQuantity,
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
    <Create actions={<CreateEditActions />}>
      <SimpleForm onSubmit={onSubmit} toolbar={<Toolbar />}>
        <TextInput source="name" label="节点名称" fullWidth />
        <NumberInput source="limit" label="可领取次数" fullWidth />
        <NumberInput source="price" label="节点价格" fullWidth />
        <TextInput source="description" label="描述" fullWidth />
        <NumberInput source="totalQuantity" label="总数量" fullWidth />
      </SimpleForm>
    </Create>
  );
};

export default NodeCreate;
