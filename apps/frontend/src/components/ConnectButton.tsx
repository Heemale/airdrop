'use client';

import {
  ConnectButton as Connect,
  useAccounts,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { useEffect } from 'react';
import { inviteClient } from '@/sdk';
import { INVITE } from '@local/airdrop-sdk/utils/constants';
import { normalizeSuiAddress } from '@mysten/sui/utils';

interface Props {
  connectText: string;
}

const ConnectButton = (props: Props) => {
  const { connectText } = props;

  const accounts = useAccounts();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const getAccount = async () => {
    if (accounts && accounts.length > 0) {
      const user = accounts[0].address;

      // 查询邀请人和root
      const [inviter, root] = await Promise.all([
        inviteClient.inviters(INVITE, user),
        inviteClient.root(INVITE),
      ]);

      if (inviter === normalizeSuiAddress('0x0')) {
        // 未绑定
        const tx = inviteClient.bind(INVITE, root);
        signAndExecuteTransaction(
          {
            transaction: tx,
          },
          {
            onSuccess: (result) => {
              console.log({ result });
              console.log({ digest: result.digest });
            },
            onError: (error) => {
              console.log({ error });
            },
          },
        );
      } else {
        // 已绑定
      }
    }
  };

  useEffect(() => {
    getAccount();
  }, [accounts]);

  return <Connect connectText={connectText} />;
};

export default ConnectButton;
