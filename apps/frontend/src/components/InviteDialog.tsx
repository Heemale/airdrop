'use client';

import React, { useState, useEffect, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import { OutlinedInput } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { inviteClient } from '@/sdk';
import { INVITE } from '@local/airdrop-sdk/utils';
import { message } from 'antd';
import { sleep } from '@/utils/time';
import { useRouter, useSearchParams } from 'next/navigation';
import { InviteDialogContext } from '@/context/InviteDialogContext';

interface Props {
  bindInviter: string;
  inviterText: string;
  noInviter: string;
  bindText: string;
}

const InviteDialog = (props: Props) => {
  const { bindInviter, bindText, inviterText } = props;

  const router = useRouter();
  const searchParams = useSearchParams(); // 获取 URL 的查询参数
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { open, setOpen } = useContext(InviteDialogContext);

  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    // 从 URL 参数解析 inviter，并存入 localStorage
    const inviterFromURL = searchParams?.get('inviter');
    const storedInviter = localStorage.getItem('inviter');

    if (inviterFromURL) {
      localStorage.setItem('inviter', inviterFromURL); // 保存到 localStorage
      setInputValue(inviterFromURL);
    } else if (storedInviter) {
      setInputValue(storedInviter);
    }
  }, [searchParams]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    localStorage.setItem('inviter', newValue); // 动态更新 localStorage
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
            router.push('/presale-comfirm');
          },
          onError: ({ message }) => {
            console.log(`Bind: ${message}`);
            messageApi.error(`Error: ${message}`);
            setLoading(false);
          },
        },
      );
    } catch (e: Error) {
      console.log(`Bind: ${e.message}`);
      messageApi.error(`Error: ${e.message}`);
      setLoading(false);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: {
          width: '95vw',
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
          color="secondary"
          value={inputValue}
          onChange={handleInputChange}
          // disabled={isBound} // 禁用输入框
        />
        <div className="w-full">
          <button
            className="w-full relative inline-block bg-[url('/button_bg.png')] bg-cover text-white font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer"
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

export default InviteDialog;
