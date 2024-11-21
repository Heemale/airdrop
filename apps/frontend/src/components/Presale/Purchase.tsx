'use client';

import * as React from 'react';
import Button from '@/components/Button';
import { inviteClient, nodeClient } from '@/sdk';
import { NODES, INVITE } from '@local/airdrop-sdk/utils';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { useContext, useEffect } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import { InviteDialogContext } from '@/context/InviteDialogContext';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { PresaleContext } from '@/context/PresaleContext';
import { message } from 'antd';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { sleep } from '@/utils/time';

interface Props {
  buyText: string;
  connectText: string;
  bindText: string;
}

const coinType: string = '0x2::sui::SUI';

const Purchase = (props: Props) => {
  const { buyText, connectText, bindText } = props;

  const account = useCurrentAccount();
  const { node } = useContext(PresaleContext);
  const { inviter, setOpen, setInviter } = useContext(InviteDialogContext);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const buyNode = async () => {
    try {
      setLoading(true);
      if (node && account && account.address) {
        const tx = await nodeClient.buy(
          coinType,
          NODES,
          INVITE,
          node.rank,
          null,
          node.price,
          account.address,
        );
        signAndExecuteTransaction(
          {
            transaction: tx,
          },
          {
            onSuccess: async (result) => {
              console.log({ digest: result.digest });
              messageApi.info(`Success: ${result.digest}`);
              setLoading(false);
            },
            onError: ({ message }) => {
              console.log(`BuyNode: ${message}`);
              messageApi.error(`Error: ${message}`);
              setLoading(false);
            },
          },
        );
      }
    } catch (e: any) {
      console.log(`BuyNode: ${e.message}`);
      messageApi.error(`Error: ${e.message}`);
      setLoading(false);
    }
  };

  const bind = () => {
    setOpen(true);
  };

  const updateInvite = async () => {
    if (account && account.address) {
      const inviter = await inviteClient.inviters(INVITE, account.address);
      setInviter(inviter);
    }
  };

  useEffect(() => {
    updateInvite();
  }, [account]);

  return (
    <div className="col-span-2">
      {account ? (
        inviter === normalizeSuiAddress('0x0') ? (
          <Button
            className="text-white w-full"
            text={bindText}
            onClick={bind}
          />
        ) : (
          <Button
            className="text-white w-full"
            text={buyText}
            onClick={buyNode}
          />
        )
      ) : (
        <ConnectWallet text={connectText} />
      )}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {contextHolder}
    </div>
  );
};

export default Purchase;
