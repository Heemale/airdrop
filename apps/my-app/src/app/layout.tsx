import type { Metadata } from 'next';
import './globals.css';
import '@mysten/dapp-kit/dist/index.css';
import Context from '@/context/Context';

export const metadata: Metadata = {
    title: 'Sui AirDrop',
    description: 'Sui AirDrop',
};

const RootLayout = async ({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) => {
    return (
        <html>
            <body className="bg-black">
                <Context>
                    {children}
                </Context>
            </body>
        </html>
    );
};

export default RootLayout;
