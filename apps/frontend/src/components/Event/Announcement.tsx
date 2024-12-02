import Image from 'next/image';
import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/app/i18n/i18nConfig';

interface Props {
  locale: string;
}

const Announcement = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div className="bg-gradient-to-b from-[#010101] to-[#222] flex flex-col gap-4 border border-gray-600 rounded-2xl sm:rounded-3xl px-6 pt-6 pb-8 text-white">
      <div className="flex gap-4 items-center">
        <Image
          src="/announcement.svg"
          width="20"
          height="20"
          alt="announcement"
        />
        <div className="">{t('Event Announcements :')}</div>
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <div>{t('Mystery Box Rules')}</div>
        <div>{t('BNB Airdrop Preview')}</div>
        <div>{t('CoralApp & Skyark | TenJin NFT Airdrop Event Ann...')}</div>
      </div>
    </div>
  );
};

export default Announcement;
