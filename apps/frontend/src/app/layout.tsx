import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import '@mysten/dapp-kit/dist/index.css';
import Context from '@/context/Context';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Context>{children}</Context>
      </body>
    </html>
  );
}
