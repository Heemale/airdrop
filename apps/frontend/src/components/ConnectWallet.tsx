'use client';

import { ConnectModal } from '@mysten/dapp-kit';
import * as React from 'react';
import { useClientTranslation } from '@/hook';

const ConnectWallet = () => {
  const { t } = useClientTranslation();

  return (
    <ConnectModal
      trigger={
        <button className="w-full relative inline-block bg-gradient-to-r from-[#40cafd] to-[#1993ee] text-white font-bold text-center text-lg py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer">
          {t('CONNECT')}
        </button>
      }
    />
  );
};

export default ConnectWallet;
