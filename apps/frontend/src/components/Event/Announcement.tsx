'use client';
import Image from 'next/image';
import * as React from 'react';
import { useClientTranslation } from '@/hook';
import { MediaConfig } from '@/api/types/response';

import { useMedia } from '@/context/MediaContext';
const BANNER_KEYS = {
  INF00: 'EVENT_ANNOUNCEMENT_TITLE',
  INFO1: 'EVENT_ANNOUNCEMENT_CONTENT_1',
  INFO2: 'EVENT_ANNOUNCEMENT_CONTENT_2',
  INFO3: 'EVENT_ANNOUNCEMENT_CONTENT_3',
  INFO4: 'EVENT_ANNOUNCEMENT_CONTENT_4',
  INFO5: 'EVENT_ANNOUNCEMENT_CONTENT_5',
  INFO6: 'EVENT_ANNOUNCEMENT_CONTENT_6',
} as const;

const Announcement = () => {
  const { t } = useClientTranslation();
  const { i18n } = useClientTranslation();
  const mediaConfig = useMedia();
  const currentLang = i18n.language as keyof MediaConfig;
  const getLocalizedText = (code: string) => {
    return mediaConfig?.[code]?.[currentLang] ?? 'Loading...'; // 添加默认值
  };

  return (
    <div
      className="text-pretty bg-gradient-to-b from-[#010101] to-[#222] flex flex-col gap-2 border border-gray-600 rounded-2xl sm:rounded-1xl px-4 pt-2 pb-4 text-white"
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
        <div>{getLocalizedText(BANNER_KEYS.INF00)}</div>
        <div>{getLocalizedText(BANNER_KEYS.INFO1)}</div>
        <div>
          <ul className="list-disc pl-5">
            <li> {getLocalizedText(BANNER_KEYS.INFO2)}</li>
            <li>{getLocalizedText(BANNER_KEYS.INFO3)}</li>
          </ul>
        </div>
        <div>{getLocalizedText(BANNER_KEYS.INFO4)}</div>

        <div>{getLocalizedText(BANNER_KEYS.INFO5)}</div>
      </div>
    </div>
  );
};

export default Announcement;
