import Image from 'next/image';
import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const Announcement = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div
      className="bg-gradient-to-b from-[#010101] to-[#222] flex flex-col gap-2 border border-gray-600 rounded-2xl sm:rounded-1xl px-4 pt-2 pb-4 text-white"
      style={{
        // maxWidth: '400px',
        width: '100%',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
      }}
    >
      <div className="flex gap-4 items-center">
        <Image
          src="/announcement.svg"
          width="20"
          height="20"
          alt="announcement"
          className="flex-shrink-0"
        />
        <div>{t('Event Announcements :')}</div>
      </div>
      <div className="flex flex-col gap-2 mt-1">
        <div>
          {t(
            'Announcement on the launch of Mercury World Platform｜Intellectual wealth and freedom',
          )}
        </div>
        <div>
          {t(
            'We are excited to announce that Mercury World, an innovative platform that integrates SUIs theme, i-Ching wisdom and blockchain technology, will be launched soon! Based on the traditional I Ching philosophy and water culture, it links the digital economy and traditional culture, and provides in-depth analysis and multi-dimensional application scenarios. The platform symbolizes the inclusiveness and power of water, and is committed to becoming a digital smart hub for global users, covering digital asset trading, smart contract applications, cross-border cooperation, etc.',
          )}
        </div>
        <div>
          <ul className="list-disc pl-5">
            <li>{t('Online benefits')}</li>
            <li>
              {t(
                'During the start-up period, a number of benefits such as registration rewards, transaction incentives, and ecological contribution awards will be launched. Early bird users can also enjoy exclusive discounts such as platform token airdrops and priority cooperation qualifications.',
              )}
            </li>
          </ul>
        </div>
        <div>
          {t(
            'Mercury World invites you to embark on a journey of digital discovery and share a better future. Please pay attention to the official website and community (WeChat, Telegram, Twitter) for the latest updates. Mercury World invites you to embark on a journey of digital discovery and share a better future. Please pay attention to the official website and community (WeChat, Telegram, Twitter) for the latest updates.',
          )}
        </div>

        <div>
          {t(
            'Mercury World - Let wisdom lead the future, and dreams are carried on Mercury!',
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcement;
