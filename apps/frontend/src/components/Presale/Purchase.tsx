'use client';

import * as React from 'react';
import Button from '@/components/Button';
import { inviteClientV2, nodeClientV2, devTransaction } from '@/sdk';
import { NODES, INVITE, PAY_COIN_TYPE, INVEST, GLOBAL } from '@/sdk';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { useContext, useEffect, useState } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import { InviteDialogContext } from '@/context/InviteDialogContext';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { PresaleContext } from '@/context/PresaleContext';
import { message } from 'antd';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useClientTranslation } from '@/hook';
import { handleDevTxError, handleTxError } from '@/sdk/error';

const Purchase = () => {
  const account = useCurrentAccount();
  const { node } = useContext(PresaleContext);
  const { inviter, setOpen, setInviter } = useContext(InviteDialogContext);
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { t } = useClientTranslation();

  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isAlreadyBuyNode, setIsAlreadyBuyNode] = useState<boolean>(false);
  const [NodeStatus, setNodeStatus] = useState<number>(0);
  const buyNode = async () => {
    try {
      if (node && account && account.address) {
        setLoading(true);
        const tx = await nodeClientV2.buy_v2(
          PAY_COIN_TYPE,
          NODES,
          INVITE,
          node.rank,
          null,
          node.price,
          account.address,
          INVEST,
          GLOBAL,
        );

        try {
          await devTransaction(tx, account.address);
        } catch (e: any) {
          messageApi.error(`${t(handleDevTxError(e.message.trim()))}`);
          setLoading(false);
          return;
        }

        signAndExecuteTransaction(
          {
            transaction: tx,
          },
          {
            onSuccess: async (result) => {
              console.log({ digest: result.digest });
              messageApi.success(`Success: ${result.digest}`);
              setLoading(false);
              await getIsAlreadyBuyNode();
            },
            onError: ({ message }) => {
              console.log(`BuyNode: ${message}`);
              messageApi.error(`${t(handleTxError(message.trim()))}`);
              setLoading(false);
            },
          },
        );
      }
    } catch (e: any) {
      console.log(`BuyNode: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message.trim()))}`);
      setLoading(false);
    }
  };

  const bind = () => {
    setOpen(true);
  };

  const getIsAlreadyBuyNode = async () => {
    if (account && account.address) {
      try {
        const user = account.address;
        const isAlreadyBuyNode = await nodeClientV2.isAlreadyBuyNode(
          NODES,
          user,
        );
        setIsAlreadyBuyNode(isAlreadyBuyNode);
      } catch (e: any) {
        console.log(`getIsAlreadyBuyNode: ${e.message}`);
        messageApi.error(`${t(handleTxError(e.message.trim()))}`);
      }
    }
  };
  const getNodeStatus = async () => {
    if (account && account.address) {
      try {
        const user = account.address;
        const getNodeStatus = await nodeClientV2.getNodeStatus(NODES, user);
        setNodeStatus(Number(getNodeStatus));
      } catch (e: any) {
        console.log(`getNodeStatus: ${e.message}`);
        messageApi.error(`${t(handleTxError(e.message.trim()))}`);
      }
    }
  };

  const updateInvite = async () => {
    if (account && account.address) {
      try {
        const user = account.address;
        const inviter = await inviteClientV2.inviters(INVITE, user);
        setInviter(inviter);
      } catch (e: any) {
        console.log(`updateInvite: ${e.message}`);
        messageApi.error(`${t(handleTxError(e.message.trim()))}`);
      }
    }
  };

  useEffect(() => {
    updateInvite();
    getIsAlreadyBuyNode();
  }, [account]);

  return (
    <div className="col-span-2">
      {account ? (
        inviter === normalizeSuiAddress('0x0') ? (
          <Button
            className="text-white w-full"
            text={t('BIND INVITER')}
            onClick={bind}
          />
        ) : NodeStatus === 1 ? (
          <button
            className={`w-full relative inline-block bg-gray-400 text-gray-700 font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform cursor-not-allowed opacity-60`}
            disabled
          >
            {t('PURCHASED EQUITY')}
          </button>
        ) : NodeStatus === 0 ? (
          <Button
            className="text-white w-full"
            text={t('BUY')}
            onClick={buyNode}
          />
        ) : NodeStatus === 2 ? (
          <Button
            className="text-white w-full"
            text={t('Activate again')}
            onClick={buyNode}
          />
        ) : (
          t('The return value gets inconsistent')
        )
      ) : (
        <ConnectWallet />
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
