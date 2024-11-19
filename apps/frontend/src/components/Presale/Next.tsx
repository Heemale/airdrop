'use client';

import Link from 'next/link';
import Button from '@/components/Button';
import * as React from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useContext, useEffect } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import { inviteClient } from '@/sdk';
import { INVITE } from '@local/airdrop-sdk/utils';
import { InviteDialogContext } from '@/context/InviteDialogContext';
import { normalizeSuiAddress } from '@mysten/sui/utils';

interface Props {
  nextText: string;
  connectText: string;
  bindText: string;
}

const Next = (props: Props) => {
  const { nextText, connectText, bindText } = props;

  const account = useCurrentAccount();
  const { inviter, setInviter, setOpen } = useContext(InviteDialogContext);

  const bind = () => {
    setOpen(true);
  };

  const updateInvite = async () => {
    if (account && account.address) {
      const user = account.address;
      // 查询邀请人和root
      const [inviter, root] = await Promise.all([
        inviteClient.inviters(INVITE, user),
        inviteClient.root(INVITE),
      ]);
      console.log({
        inviter,
        root,
      });
      setInviter(inviter);
    }
  };

  useEffect(() => {
    updateInvite();
  }, [account]);

  return (
    <div>
      {account ? (
        inviter === normalizeSuiAddress('0x0') ? (
          <Button
            className="text-white w-full"
            text={bindText}
            onClick={bind}
          />
        ) : (
          <Link href={'/presale-comfirm'}>
            <Button className="text-white w-full" text={nextText} />
          </Link>
        )
      ) : (
        <ConnectWallet text={connectText} />
      )}
    </div>
  );
};

export default Next;
