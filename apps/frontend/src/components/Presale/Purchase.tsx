'use client';

import * as React from 'react';
import Button from '@/components/Button';
import { nodeClient } from '@/sdk';
import { NODES, INVITE } from '@local/airdrop-sdk/utils/constants';
import { useAccounts, useSignAndExecuteTransaction } from '@mysten/dapp-kit';

interface Props {
  locale: string;
}

const Purchase = (props: Props) => {
  const { locale } = props;
  const accounts = useAccounts();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const coinType: string = '0x2::sui::SUI';
  const rank: number = 1;

  const buyNode = async () => {
    if (accounts && accounts.length > 0) {
      const user = accounts[0].address;
      const tx = await nodeClient.buy(
        coinType,
        NODES,
        INVITE,
        rank,
        undefined,
        user,
      );
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
    }
  };

  return (
    <div className="col-span-2" onClick={buyNode}>
      <Button className="text-white w-full" text={'Purchase'} locale={locale} />
    </div>
  );
};

export default Purchase;
