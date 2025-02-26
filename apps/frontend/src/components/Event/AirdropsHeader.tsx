'use client';
import Button from '@/components/Button';
import * as React from 'react';
import Link from 'next/link';
import { useClientTranslation } from '@/hook';

interface Props {
  locale: string;
}

const AirdropsHeader =  () => {
  const { t } = useClientTranslation();

  return (
    <div className="flex justify-between">
      <div className="text-center">
        <div className="text-white text-xl font-bold">
          {t('Ongoing Airdrops')}
        </div>
        <div className="w-1/2 h-1 bg-gradient-to-r from-[#40cafd] to-[#1993ee] mx-auto mt-2 rounded-3xl"></div>
      </div>
      <Link href={'/airdrop-list'}>
        <Button text={t('All Airdrops')} />
      </Link>
    </div>
  );
};

export default AirdropsHeader;
