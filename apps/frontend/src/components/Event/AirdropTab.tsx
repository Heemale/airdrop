'use client';
import { useClientTranslation } from '@/hook';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  {
    id: '1',
    href: 'airdrop-list',
    text: 'Airdrops',
  },
  {
    id: '2',
    href: 'benefits',
    text: 'My Airdrop Benefits',
  },
];

const isActive = (href: string, pathname: string) => {
  return pathname.includes(href);
};

const AirdropTab = () => {
  const { t } = useClientTranslation();
  const pathname = usePathname();

  return (
    <>
      <Link href={'/event'} className="cursor-pointer">
        {'< '}
        {t('Airdrop event')}
      </Link>
      <div className="flex gap-6">
        {links.map((link) => (
          <Link key={link.id} href={`/${link.href}`}>
            <div className="text-center cursor-pointer">
              <div className="text-white text-xl font-bold">{t(link.text)}</div>
              {isActive(link.href, pathname) && (
                <div className="w-1/2 h-1 bg-gradient-to-r from-[#40cafd] to-[#1993ee] mx-auto mt-2 rounded-3xl"></div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default AirdropTab;
