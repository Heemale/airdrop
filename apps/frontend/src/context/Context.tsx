'use client';
import QueryClientProvider from './QueryClientProvider';
import SuiClientProvider from './SuiClientProvider';
import SuiWalletProvider from './SuiWalletProvider';
import InviteDialogContextProvider from '@/context/InviteDialogContext';
import PresaleContextProvider from '@/context/PresaleContext';

const Context = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider>
      <SuiClientProvider>
        <SuiWalletProvider>
          <InviteDialogContextProvider>
            <PresaleContextProvider>{children}</PresaleContextProvider>
          </InviteDialogContextProvider>
        </SuiWalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default Context;
