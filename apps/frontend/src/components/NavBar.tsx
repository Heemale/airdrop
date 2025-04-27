'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LanguageChanger, { languages } from '@/components/LanguageChanger';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const removeLanguagePrefix = (path: string) => {
    // 分割路径并过滤空段
    const segments = path.split('/').filter((p) => p !== '');

    // 匹配语言前缀（如 zh/en/vi）
    const lang = languages.find((l) => l.key === segments[0]);

    // 处理带语言前缀的情况
    if (lang) {
      const remaining = segments.slice(1);

      // 仅语言前缀时返回根路径，否则拼接剩余路径
      return remaining.length > 0 ? `/${remaining.join('/')}` : '/';
    }

    // 无语言前缀时返回原始路径
    return path;
  };

  const isActive = (link: string, pathname: string) => {
    const cleanPathname = removeLanguagePrefix(pathname);
    return cleanPathname === link || cleanPathname.startsWith(link + '/');
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === 'Tab' || event.key === 'Shift') {
          return;
        }
      }
      setDrawerOpen(open);
    };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-screen-xl flex justify-between items-center py-5 px-4">
        <div className="w-[115px] sm:w-[320px] items-center">
          <Link href={'/'}>
            <Image src="/03.jpg" width={320} height={280} alt="logo" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-10 items-center">
          {pages.map((page) => (
            <Link
              key={page.id}
              href={page.link}
              className="flex items-center gap-2 -webkit-tap-highlight-color-transparent"
              onClick={() => setSelectedPage(page.id)}
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <Image
                src={
                  selectedPage === page.id
                    ? `/HomeIcon${page.id}.png`
                    : page.icon
                }
                width={20}
                height={20}
                alt={`${page.name} icon`}
                className="inline-block"
              />
              <div
                className={`transition-colors ${isActive(page.link, pathname)
                    ? 'bg-gradient-to-r from-[#40cafd] to-[#1993ee] text-transparent bg-clip-text'
                    : 'text-white hover:text-[#40cafd]'
                  }`}
              >
                {page.name}
              </div>
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
          <div className="w-64 p-4 text-white bg-black h-full">
            <List>
              {pages.map((page) => (
                <ListItem
                  key={page.id}
                  component={Link}
                  href={page.link}
                  className="flex items-center gap-2"
                  onClick={toggleDrawer(false)}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <Image
                    src={page.icon}
                    width={20}
                    height={20}
                    alt={`${page.name} icon`}
                  />
                  <ListItemText
                    primary={
                      <span
                        className={
                          isActive(page.link, pathname)
                            ? 'bg-gradient-to-r from-[#40cafd] to-[#1993ee] text-transparent bg-clip-text'
                            : 'text-white'
                        }
                      >
                        {page.name}
                      </span>
                    }
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
