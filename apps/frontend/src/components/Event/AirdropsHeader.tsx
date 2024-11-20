import Button from '@/components/Button';
import * as React from 'react';
import Link from 'next/link';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const AirdropsHeader = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div className="flex justify-between">
      <div className="text-center">
        <div className="text-white text-xl font-bold">
          {t('Ongoing Airdrops')}
        </div>
        <div className="w-1/2 h-1 bg-gradient-to-r from-[#ffbdad] to-[#e7534f] mx-auto mt-2 rounded-3xl"></div>
      </div>
      <Link href={'/airdrop-list'}>
        <Button text={t('All Airdrops')} />
      </Link>
    </div>
  );
};

export default AirdropsHeader;
