'use client';

import * as React from 'react';
import Image from 'next/image';
import ConnectButton from '@/components/ConnectButton';
import Link from 'next/link';
import LanguageChanger from '@/components/LanguageChanger';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useState } from 'react';

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <div className="bg-black flex flex-col items-center">
      <div className="w-full max-w-screen-xl flex justify-between items-center py-5 px-4">
        <div className="w-[115px] sm:w-[320px] items-center">
          <Link href={'/'}>
            <Image src="/logo.png" width="320" height="320" alt="logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex gap-10 items-center">
          {pages &&
            pages.map((page) => (
              <Link key={page.id} href={page.link}>
                <div className="text-gradient">{page.name}</div>
              </Link>
            ))}
          <LanguageChanger />
          <ConnectButton />
        </div>

        {/* Mobile Navigation */}
        <div className="flex sm:hidden items-center gap-4">
          <ConnectButton />
          <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <Image
              src="/home_header.png"
              width="20"
              height="20"
              alt="home-header"
            />
          </IconButton>
        </div>

        {/* Drawer for Mobile */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <div
            className="w-64 p-4 text-white bg-black h-full"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              {pages &&
                pages.map((page) => (
                  <ListItem
                    button
                    key={page.id}
                    component={Link}
                    href={page.link}
                  >
                    <ListItemText
                      className="text-gradient"
                      primary={page.name}
                    />
                  </ListItem>
                ))}
              <ListItem>
                <LanguageChanger />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default NavBar;
