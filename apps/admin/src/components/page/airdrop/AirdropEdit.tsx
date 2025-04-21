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
import MyDateTimePicker from '@/components/ui/MyDateTimePicker';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { airdropClient, devTransaction } from '@/sdk';
import { ADMIN_CAP, AIRDROPS } from '@/sdk/constants';
import { handleDevTxError } from '@/sdk/error';
import { useNotify } from 'react-admin';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CreateEditActions from '@/components/ui/CreateEditActions';
import { convertSmallToLarge } from '@/utils/math';

const Toolbar = (props: any) => (
  <RaToolbar {...props}>
    <SaveButton label="修改" />
  </RaToolbar>
);

const AirdropEdit = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();

  const onSubmit = async (data: any) => {
    if (!account) return;

    try {
      const tx = airdropClient.modify(
        ADMIN_CAP,
        AIRDROPS,
        data.round,
        BigInt(convertSmallToLarge(data.startTime, 3)),
        BigInt(convertSmallToLarge(data.endTime, 3)),
        data.isOpen,
        data.description,
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextInput source="id" label="ID" disabled fullWidth />
          <NumberInput source="round" label="回合" fullWidth />
          <div className="pb-6">
            <MyDateTimePicker source="startTime" label="开始时间" />
          </div>
          <div className="pb-6">
            <MyDateTimePicker source="endTime" label="结束时间" />
          </div>
          <TextInput source="description" label="描述" fullWidth />
          <BooleanInput source="isOpen" label="是否开启" fullWidth />
        </LocalizationProvider>
      </SimpleForm>
    </Edit>
  );
};

export default AirdropEdit;
