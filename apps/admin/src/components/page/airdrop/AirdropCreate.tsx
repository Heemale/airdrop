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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import MyDateTimePicker from '@/components/ui/MyDateTimePicker';
import {
  airdropClient,
  commonClient,
  devTransaction,
  getCoinMetaData,
} from '@/sdk';
import { ADMIN_CAP, AIRDROPS } from '@/sdk/constants';
import { handleDevTxError } from '@/sdk/error';
import { Transaction } from '@mysten/sui/transactions';
import { convertLargeToSmall } from '@/utils/math';
import CreateEditActions from '@/components/ui/CreateEditActions';

const Toolbar = (props: any) => (
  <RaToolbar {...props}>
    <SaveButton label="添加" />
  </RaToolbar>
);

const AirdropCreate = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();

  const onSubmit = async (data: any) => {
    if (!account) return;

    try {
      const coinData = await getCoinMetaData({
        coinType: data.coinType,
      });

      const decimals = coinData ? coinData.decimals : 1;

      const payAmount = BigInt(
        convertLargeToSmall(data.totalBalance, decimals),
      );

      const tx = new Transaction();

      const sender = account.address;

      const payCoin = await commonClient.preparePaymentCoin(
        tx,
        data.coinType,
        payAmount,
        sender,
      );

      airdropClient.insert(
        tx,
        data.coinType,
        ADMIN_CAP,
        AIRDROPS,
        data.startTime,
        data.endTime,
        data.totalShares,
        payAmount,
        data.description,
        payCoin,
        data.imageUrl,
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextInput source="coinType" label="代币类型" fullWidth />
          <div className="pb-6">
            <MyDateTimePicker source="startTime" label="开始时间" />
          </div>
          <div className="pb-6">
            <MyDateTimePicker source="endTime" label="结束时间" />
          </div>
          <NumberInput source="totalShares" label="总份数" fullWidth />
          <NumberInput source="totalBalance" label="总金额" fullWidth />
          <TextInput source="description" label="描述" fullWidth />
          <TextInput source="imageUrl" label="图片链接" fullWidth />
        </LocalizationProvider>
      </SimpleForm>
    </Create>
  );
};

export default AirdropCreate;
