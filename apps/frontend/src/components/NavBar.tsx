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
import './sui-button.css';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}
// 定义页面对象的类型
interface Page {
  id: string;
  name: string;
  link: string;
}

// 定义组件的类型
const pages: Page[] = [
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

const NavBar: React.FC<Props> = async (props: Props) => {
  // 状态：抽屉是否打开
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { locale } = props;
  const { t, resources } = await initTranslations(
    locale,
    i18nConfig.i18nNamespaces,
  );
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
            <Image src="/logo.png" width={320} height={320} alt="logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 items-center">
          {pages.map((page) => (
            <Link key={page.id} href={page.link}>
              <div className="text-gradient">{t(page.name)}</div>
            </Link>
          ))}
          <LanguageChanger />
          <ConnectButton locale={locale} />
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-4">
          <ConnectButton locale={locale} />
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
            onClick={toggleDrawer(false)}
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
                  <ListItemText
                    className="text-gradient"
                    primary={t(page.name)}
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
