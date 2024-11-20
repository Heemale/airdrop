'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { useContext } from 'react';
import { InviteDialogContext } from '@/context/InviteDialogContext';
import { OutlinedInput } from '@mui/material';
import { useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { inviteClient } from '@/sdk';
import { INVITE } from '@local/airdrop-sdk/utils';
import PinkSwitch from '@/components/PinkSwitch';
import { message } from 'antd';

const InviteDialog = () => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { open, hasInviter, setOpen, setHasInviter } =
    useContext(InviteDialogContext);

  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(event.target.value);

  const handleClose = () => {
    setOpen(false);
  };

  const handleBind = async () => {
    try {
      const root = await inviteClient.root(INVITE);
      const inviter = !hasInviter ? root : inputValue;
      const tx = inviteClient.bind(INVITE, inviter);
      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: (result) => {
            console.log({ digest: result.digest });
            messageApi.info(`Success: ${result.digest}`);
          },
          onError: ({ message }) => {
            console.log(`Bind: ${message}`);
            messageApi.error(`Error: ${message}`);
          },
        },
      );
    } catch ({ message }) {
      console.log(`Bind: ${message}`);
      messageApi.error(`Error: ${message}`);
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
        <div className="text-white font-bold">Bind Inviter</div>
        <OutlinedInput
          id="outlined-adornment-weight"
          aria-describedby="outlined-weight-helper-text"
          // startAdornment={
          //     <InputAdornment position="start">
          //         <div className="text-white">
          //             Limit amount {'<='} {minimum}
          //         </div>
          //     </InputAdornment>
          // }
          placeholder={`inviter`}
          sx={{
            background: '#2b2b2b',
            color: '#ffffff',
          }}
          color="secondary"
          value={inputValue} // 使用输入框的值作为value属性的值
          onChange={handleInputChange} // 处理输入框值的变化
        />
        <div className="text-white font-bold">No Invite</div>
        <PinkSwitch
          checked={!hasInviter}
          onChange={() => setHasInviter(!hasInviter)}
          inputProps={{ 'aria-label': 'controlled' }}
        />
        <div className="w-full">
          <button
            className="w-full relative inline-block bg-[url('/button_bg.png')] bg-cover text-white font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer"
            onClick={handleBind}
          >
            BIND
          </button>
        </div>
      </div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {contextHolder}
    </Dialog>
  );
};

export default InviteDialog;
