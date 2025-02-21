'use client';
import { SuiClientProvider as ClientProvider } from '@mysten/dapp-kit';
import { createNetworkConfig } from '@mysten/dapp-kit';
import React from 'react';
import { SUI_FULL_NODE } from '@/config';

const SuiClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { networkConfig } = createNetworkConfig({
    mainnet: {
      url: SUI_FULL_NODE,
    },
  });

  return (
    <ClientProvider networks={networkConfig} defaultNetwork="mainnet">
      {children}
    </ClientProvider>
  );
};

export default SuiClientProvider;
