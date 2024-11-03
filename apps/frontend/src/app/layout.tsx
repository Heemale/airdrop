import type { Metadata } from 'next';
import './globals.css';
import '@mysten/dapp-kit/dist/index.css';
import Context from '@/context/Context';

export const metadata: Metadata = {
  title: 'Sui AirDrop',
  description: 'Sui AirDrop',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black">
        <Context>{children}</Context>
      </body>
    </html>
  );
}
