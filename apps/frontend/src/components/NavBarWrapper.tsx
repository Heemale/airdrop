'use client';
import * as React from 'react';
import NavBar from './NavBar';
import ConnectButton from '@/components/ConnectButton';
import { useClientTranslation } from '@/hook';

export interface Page {
  id: string;
  name: string;
  link: string;
}

const pages: Array<Page> = [
  {
    id: '0',
    name: 'Home',
    link: '/',
  },
  {
    id: '1',
    name: 'Equity subscription',
    link: '/presale',
  },
  {
    id: '2',
    name: 'Airdrop event',
    link: '/event',
  },
  {
    id: '3',
    name: 'Personal center',
    link: '/personal-center',
  },
];

const NavBarWrapper = () => {
  const { t } = useClientTranslation();

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
