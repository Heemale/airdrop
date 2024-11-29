'use client';

import * as React from 'react';
import Image from 'next/image';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18nConfig from '@/i18nConfig';

interface LanguageType {
  key: string;
  name: string;
}

const languages: Array<LanguageType> = [
  {
    key: 'en',
    name: 'English',
  },
  {
    key: 'zh',
    name: '简体中文',
  },
];

const LanguageChanger = () => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<any>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (key: string) => {
    const newLocale = key;

    // set cookie for next-i18n-router
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // redirect to the new locale path
    if (currentLocale === i18nConfig.defaultLocale) {
      router.push('/' + newLocale + currentPathname);
    } else {
      router.push(
        currentPathname.replace(`/${currentLocale}`, `/${newLocale}`),
      );
    }

    router.refresh();
  };

  return (
    <div>
      <Image
        src="/language.png"
        alt="change language"
        width={24}
        height={24}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {languages &&
          languages.map((item) => (
            <MenuItem key={item.key} onClick={() => changeLanguage(item.key)}>
              {item.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};

export default LanguageChanger;
