import type { Metadata } from 'next';
import './globals.css';
import '@mysten/dapp-kit/dist/index.css';
import QueryClientProvider from '@/context/QueryClientProvider';
import SuiClientProvider from '@/context/sui/SuiClientProvider';
import SuiWalletProvider from '@/context/sui/SuiWalletProvider';
import MuiXLicense from '@/components/MuiXLicense';

export const metadata: Metadata = {
  title: 'Mercury World',
  description: 'Mercury World',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <SuiClientProvider>
            <SuiWalletProvider>{children}</SuiWalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
        <MuiXLicense />
      </body>
    </html>
  );
}
