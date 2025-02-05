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
import { inviteClientV1, devTransaction } from '@/sdk';
import { INVITE } from '@local/airdrop-sdk/utils';
import { message } from 'antd';
import { sleep } from '@/utils/time';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { InviteDialogContext } from '@/context/InviteDialogContext';
import { Suspense } from 'react';
import { handleTxError, handleDevTxError } from '@/sdk/error';
import { useClientTranslation } from '@/hook';
import i18nConfig from '@/i18nConfig';
import { formatAddress } from '@mysten/sui/utils';
import initTranslations from '@/app/i18n';

const InviteDialog = () => {
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
    if (!account) return;
    setLoading(true);
    try {
      const tx = inviteClientV1.bind(INVITE, inputValue);

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
            await sleep(1);
            setOpen(false);
            router.push('/presale-confirm');
          },
          onError: ({ message }) => {
            console.log(`Bind: ${message}`);
            messageApi.error(`${t(handleTxError(message.trim()))}`);
            setLoading(false);
          },
        },
      );
    } catch (e: any) {
      console.log(`Bind: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message.trim()))}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    // 访问首页才更新 inviter
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
    // 切换账号要清除 inviter
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
          maxWidth: '600px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'rgba(13, 24, 41, 1)',
          borderRadius: '20px',
          marginLeft: '2px',
          marginRight: '2px',
          position: 'relative',
          padding: '20px 0',
        },
      }}
    >
      <div className="relative">
        <div className="flex justify-center">
          <img src="/bind.png" alt="" className="w-30 h-30" />
        </div>
        <div className="flex flex-col gap-4 mx-4 mt-8">
          <div className="text-white text-2xl font-bold text-center mb-4">
            {t('Please enter your invitation code')}
          </div>
          <OutlinedInput
            id="outlined-adornment-weight"
            aria-describedby="outlined-weight-helper-text"
            placeholder="Please enter your invitation code"
            sx={{
              background: '#2C3E50',
              color: '#ffffff',
              '& .MuiInputBase-input::placeholder': {
                textAlign: 'center', // 使placeholder文字居中
              },
            }}
            color="primary"
            value={inputValue}
            onChange={handleInputChange}
          />
          <div className="flex text-white font-bold gap-1">
            {t('Inviter Preview')}: {formatAddress(inputValue)}
          </div>
          <div className="w-full">
            <button
              className="w-full relative inline-block bg-gradient-to-r from-[#40cafd] to-[#1993ee] text-white font-bold text-center text-lg py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer"
              onClick={handleBind}
            >
              {t('BIND INVITER')}
            </button>
          </div>
        </div>
        <div
          className="text-sm font-bold text-center mb-4"
          style={{ color: '#ffffff' }}
        >
          {t('You need to bind the inviter before you can purchase benefits.')}
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

const InviteDialogSuspense = () => (
  <Suspense>
    <InviteDialog />
  </Suspense>
);

export default InviteDialogSuspense;
