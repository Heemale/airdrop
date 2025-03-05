'use client';
import * as React from 'react';
import { useClientTranslation } from '@/hook';
import { MediaConfig } from '@/api/types/response';

import { useMedia } from '@/context/MediaContext';
const BANNER_KEYS = {
  INFO1: 'HOME_BANNER_INFO_1',
  INFO2: 'HOME_BANNER_INFO_2',
  INFO3: 'HOME_BANNER_INFO_3',
} as const;
const BannerDescription = () => {
  const { i18n } = useClientTranslation();
  const mediaConfig = useMedia();
  const currentLang = i18n.language as keyof MediaConfig;
  const getLocalizedText = (code: string) => {
    return mediaConfig?.[code]?.[currentLang] ?? 'Loading...'; // 添加默认值
  };

  return (
    <div className="w-3/4">
      <div className="text-pretty sm:w-2/3 flex flex-col sm:gap-1 text-white text-sm sm:text-lg -mt-2">
        <div>{getLocalizedText(BANNER_KEYS.INFO1)}</div>
        <div>{getLocalizedText(BANNER_KEYS.INFO2)}</div>
        <div>{getLocalizedText(BANNER_KEYS.INFO3)}</div>
      </div>
    </div>
  );
};

export default BannerDescription;
