'use client';
import * as React from 'react';
import NavBar from './NavBar';
import ConnectButton from '@/components/ConnectButton';
import { useClientTranslation } from '@/hook';
import { usePathname } from 'next/navigation';
export interface Page {
  id: string;
  name: string;
  link: string;
  icon: string;
}

const pages: Array<Page> = [
  {
    id: '0',
    name: 'Home',
    link: '/',
    icon: '/HomeIconImage1.png', // 添加图标路径
  },
  {
    id: '1',
    name: 'Equity subscription',
    link: '/presale',
    icon: '/HomeIconImage2.png',
  },
  {
    id: '2',
    name: 'Airdrop event',
    link: '/event',
    icon: '/HomeIconImage3.png',
  },
  {
    id: '3',
    name: 'Personal center',
    link: '/personal-center',
    icon: '/HomeIconImage4.png',
  },
];

const isActive = (href: string, pathname: string) => {
  return pathname.includes(href);
};
const NavBarWrapper = () => {
  const { t } = useClientTranslation();
  const pathname = usePathname();

  return (
    <NavBar
      pages={pages.map((page) => {
        const { name, ...rest } = page;
        return {
          name: t(name),
          ...rest,
        };
      })}
    >
      <ConnectButton connectText="CONNECT" />
    </NavBar>
  );
};

export default NavBarWrapper;
