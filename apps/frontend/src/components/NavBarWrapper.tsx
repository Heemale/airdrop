import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';
import NavBar from './NavBar';
import ConnectButton from '@/components/ConnectButton';

interface Props {
  locale: string;
}

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
    name: 'Presale',
    link: '/presale',
  },
  {
    id: '2',
    name: 'Event',
    link: 'event',
  },
];

const NavBarWrapper = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

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
      <ConnectButton connectText={t('CONNECT')} />
    </NavBar>
  );
};

export default NavBarWrapper;
