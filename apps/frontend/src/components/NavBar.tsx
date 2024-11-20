'use client';

import * as React from 'react';
import Image from 'next/image';
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
import { Page } from './NavBarWrapper';
import './sui-button.css';

interface Props {
  pages: Array<Page>;
  children: React.ReactNode;
}

const NavBar = (props: Props) => {
  const { pages, children } = props;
  // 状态：抽屉是否打开
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  // 切换抽屉的状态
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      // 避免按 Tab 或 Shift 键时关闭抽屉
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
            <Image src="/01.png" width={320} height={280} alt="logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 items-center">
          {pages.map((page) => (
            <Link key={page.id} href={page.link}>
              <div className="text-gradient">{page.name}</div>
            </Link>
          ))}
          <LanguageChanger />
          {children}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-4">
          {children}
          <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <Image
              src="/home_header.png"
              width={20}
              height={20}
              alt="home-header"
            />
          </IconButton>
        </div>

        {/* Drawer for Mobile */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <div
            className="w-64 p-4 text-white bg-black h-full"
            onKeyDown={toggleDrawer(false)}
          >
            <List>
              {pages.map((page) => (
                <ListItem
                  button
                  key={page.id}
                  component={Link}
                  href={page.link}
                >
                  <ListItemText className="text-gradient" primary={page.name} />
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
