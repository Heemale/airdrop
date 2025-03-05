'use client';
import * as React from 'react';
import BannerBottom from '@/components/Home/BannerBottom';
import { useClientTranslation } from '@/hook';
import { MediaConfig } from '@/api/types/response';
import { useMedia } from '@/context/MediaContext';

const BANNER_KEYS = {
  INFO1: 'HOME_ABOUT_INFO',
} as const;
const About = () => {
  const { t } = useClientTranslation();
  const { i18n } = useClientTranslation();
  const mediaConfig = useMedia();
  const currentLang = i18n.language as keyof MediaConfig;
  const getLocalizedText = (code: string) => {
    return mediaConfig?.[code]?.[currentLang] ?? 'Loading...'; // 添加默认值
  };

  return (
    <div className="bg-[url('/home_banner_bg2_2.png')] sm:bg-[url('/home_banner_bg2.jpg')] bg-contain bg-no-repeat sm:bg-cover bg-right flex flex-col gap-6 sm:gap-12 sm:mb-0 sm:h-[900px]">
      <div className="max-w-screen-xl flex flex-col lg:flex-row items-center gap-2 sm:gap-10 text-white h-[780px] mx-4 sm:mx-16">
        <div className="flex-1">
          <div className="mb-2 sm:mb-8">
            <div className="flex gap-4 justify-center sm:justify-start sm:gap-10 mb-4 sm:mb-0">
              <BannerBottom />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-2 items-center text-2xl sm:text-3xl font-bold text-gradient">
            <div>{t('About Mercury World')}</div>
            <div className="hidden sm:flex">-</div>
            <div>Mercury World</div>
          </div>
          <div className="mt-10 text-sm sm:text-lg leading-relaxed sm:w-3/5">
            {getLocalizedText(BANNER_KEYS.INFO1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
