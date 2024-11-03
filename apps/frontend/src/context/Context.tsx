'use client';
import dynamic from 'next/dynamic';
import QueryClientProvider from './QueryClientProvider';
import SuiClientProvider from './SuiClientProvider';

const SuiWalletProvider = dynamic(() => import('./SuiWalletProvider'));

const Context = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider>
      <SuiClientProvider>
        <SuiWalletProvider>{children}</SuiWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default Context;
