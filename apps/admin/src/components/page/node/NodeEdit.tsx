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
import { airdropClient, devTransaction } from '@/sdk';
import { ADMIN_CAP, NODES } from '@/sdk/constants';
import { handleDevTxError } from '@/sdk/error';
import { useNotify } from 'react-admin';

const PostEditToolbar = (props: any) => (
  <Toolbar {...props}>
    <SaveButton label="修改" />
  </Toolbar>
);

const NodeEdit = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();

  const onSubmit = async (data: any) => {
    if (!account) return;

    try {
      const tx = airdropClient.modifyNode(
        ADMIN_CAP,
        NODES,
        data.rank,
        data.name,
        data.description,
        data.price,
        data.limit,
        data.totalQuantity,
        data.isOpen,
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
        <NumberInput source="rank" label="节点等级" fullWidth />
        <TextInput source="name" label="名称" fullWidth />
        <TextInput source="description" label="描述" fullWidth />
        <NumberInput source="limit" label="可领取次数" fullWidth />
        <NumberInput
          source="price"
          label="节点价格"
          format={(value) =>
            value ? convertSmallToLarge(value.toString(), TOKEN_DECIMAL) : 0
          }
          parse={(value) =>
            value ? convertLargeToSmall(value.toString(), TOKEN_DECIMAL) : 0
          }
        />
        <NumberInput source="totalQuantity" label="总数量" fullWidth />
        <BooleanInput source="isOpen" label="是否开启" fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default NodeEdit;
