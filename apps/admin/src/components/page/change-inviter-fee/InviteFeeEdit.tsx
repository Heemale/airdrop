import React, { useEffect, useState } from 'react';
import { SimpleForm, TextInput, useNotify, NumberInput } from 'react-admin';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { airdropClient, devTransaction, inviteClient } from '@/sdk';
import { handleDevTxError } from '@/sdk/error';
import { INVITE, ADMIN_CAP } from '@/sdk/constants';
import { sleep } from '@/utils/time';

const InviteFeeEdit = () => {
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const notify = useNotify();
  const [root, setRoot] = useState<string>('');
  const [fee, setFee] = useState<number>(0);

  const fetchInviteInfo = async () => {
    try {
      const [rootAddress, inviterFee] = await Promise.all([
        inviteClient.root(INVITE),
        inviteClient.inviterFee(INVITE),
      ]);
      setRoot(rootAddress);
      setFee(Number(inviterFee) / 100);
    } catch (error: any) {
      notify(`获取信息失败: ${error.message}`, { type: 'error' });
      console.error(error);
    }
  };

  const onSubmit = async (data: any) => {
    if (!account) {
      notify('请先连接钱包', { type: 'error' });
      return;
    }
    if (data.inviter_fee < 0.01) {
      console.error('分红比例不能低于0.01%');
      return;
    }
    if (!data?.address && !data?.inviter_fee) {
      notify('请填写完整', { type: 'error' });
      return;
    }

    try {
      const tx = airdropClient.modifyInvite(
        ADMIN_CAP,
        INVITE,
        data.address,
        BigInt(data.inviter_fee * 100),
      );

      await devTransaction(tx, account.address);

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: async (result) => {
            notify(`修改成功, 交易hash: ${result.digest}`, { type: 'success' });
            sleep(2);
            fetchInviteInfo();
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

  useEffect(() => {
    fetchInviteInfo();
  }, []);

  return (
    <>
      <SimpleForm onSubmit={onSubmit}>
        <div>
          <div>
            <div>当前根用户地址: {root || '加载中...'}</div>
            <div>当前邀请人分红费率: {fee ? `${fee}%` : '加载中...'}</div>
          </div>
        </div>
        <TextInput
          source="address"
          label="根用户"
          fullWidth
          helperText="请输入新的根用户地址"
        />
        <NumberInput
          source="inviter_fee"
          label="邀请人分红费率"
          fullWidth
          helperText="请输入新的分红费率（百分比）"
        />
      </SimpleForm>
    </>
  );
};

export default InviteFeeEdit;
