'use client';

import { ConnectModal } from '@mysten/dapp-kit';
import * as React from 'react';

interface Props {
  text: string;
}

const ConnectWallet = (props: Props) => {
  const { text } = props;

  return (
    <ConnectModal
      trigger={
        <button className="w-full relative inline-block bg-[url('/button_bg.png')] bg-cover text-white font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer">
          {text}
        </button>
      }
    />
  );
};

export default ConnectWallet;
