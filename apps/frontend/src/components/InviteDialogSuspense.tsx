'use client';

import React, { useState, useEffect, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import { OutlinedInput } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from '@mysten/dapp-kit';
import { inviteClient } from '@/sdk';
import { INVITE } from '@local/airdrop-sdk/utils';
import { message } from 'antd';
import { sleep } from '@/utils/time';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { InviteDialogContext } from '@/context/InviteDialogContext';
import { Suspense } from 'react';
import { handleTxError } from '@/sdk/error';
import { useClientTranslation } from '@/hook';
import i18nConfig from '@/i18nConfig';

interface Props {
  bindInviter: string;
  inviterText: string;
  noInviter: string;
  bindText: string;
}
const InviteDialog = (props: Props) => {
  const { bindInviter, bindText, inviterText } = props;

  const { t } = useClientTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const account = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { open, setOpen } = useContext(InviteDialogContext);

  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBind = async () => {
    try {
      setLoading(true);
      const tx = inviteClient.bind(INVITE, inputValue);
      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: async (result) => {
            console.log({ digest: result.digest });
            messageApi.success(`Success: ${result.digest}`);
            setLoading(false);
            await sleep(1);
            setOpen(false);
            router.push('/presale-confirm');
          },
          onError: ({ message }) => {
            console.log(`Bind: ${message}`);
            messageApi.error(`Error: ${t(handleTxError(message))}`);
            setLoading(false);
          },
        },
      );
    } catch (e: any) {
      console.log(`Bind: ${e.message}`);
      messageApi.error(`Error: ${t(handleTxError(e.message))}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    // 访问首页才更新inviter
    const pathnameHandled = pathname.startsWith('/')
      ? pathname.slice(1)
      : pathname;
    if (
      pathnameHandled === '' ||
      i18nConfig.locales.includes(pathnameHandled)
    ) {
      const inviter = searchParams?.get('inviter');
      setInputValue(inviter ? inviter : '');
    }
  }, [searchParams]);

  useEffect(() => {
    // 切换账号要清除inviter
    if (account) {
      const addressBefore = localStorage.getItem('address');
      if (addressBefore && addressBefore !== '') {
        setInputValue('');
      }
      localStorage.setItem('address', account.address);
    }
  }, [account]);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: {
          width: '90vw',
          height: '64vh',
          maxWidth: '500px',
          maxHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#262626',
          borderRadius: '20px',
          marginLeft: '2px',
          marginRight: '2px',
        },
      }}
    >
      <div className="flex flex-col gap-4 mx-4">
        <div className="text-white font-bold">{bindInviter}</div>
        <OutlinedInput
          id="outlined-adornment-weight"
          aria-describedby="outlined-weight-helper-text"
          placeholder={inviterText}
          sx={{
            background: '#2b2b2b',
            color: '#ffffff',
          }}
          color="primary"
          value={inputValue}
          onChange={handleInputChange}
          // disabled={isBound} // 禁用输入框
        />
        <div className="w-full">
          <button
            className="w-full relative inline-block bg-gradient-to-r from-[#40cafd] to-[#1993ee] text-white font-bold text-center text-lg py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer"
            onClick={handleBind}
          >
            {bindText}
          </button>
        </div>
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {contextHolder}
    </Dialog>
  );
};

const InviteDialogSuspense = (props: Props) => {
  const { bindInviter, bindText, inviterText, noInviter } = props;
  return (
    <Suspense>
      <InviteDialog
        bindInviter={bindInviter}
        inviterText={inviterText}
        noInviter={noInviter}
        bindText={bindText}
      />
    </Suspense>
  );
};

export default InviteDialogSuspense;
