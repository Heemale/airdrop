'use client';

import * as React from 'react';
import Image from 'next/image';
import ConnectButton from '@/components/ConnectButton';
import Link from 'next/link';
import LanguageChanger from '@/components/LanguageChanger';

const pages = [
  {
    id: '0',
    name: 'Home',
    link: '/',
  },
  {
    id: '1',
    name: 'Presale',
    link: '/presale',
  },
  {
    id: '2',
    name: 'Event',
    link: 'event',
  },
];

const NavBar = () => {
  return (
    <div className="bg-black">
      <div className="flex justify-between mx-[30px] my-2">
        <div className="flex gap-8">
          <div className="flex items-center">
            <Link href="/">
              <Image src="/logo.png" width="320" height="320" alt="logo" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-10 text-white items-center">
          {pages &&
            pages.map((page) => {
              return (
                <Link key={page.id} href={page.link}>
                  {page.name}
                </Link>
              );
            })}
          <LanguageChanger />
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
