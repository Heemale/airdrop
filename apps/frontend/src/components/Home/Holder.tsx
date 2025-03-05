'use client';
import * as React from 'react';
import Image from 'next/image';
import { useClientTranslation } from '@/hook';
import { MediaConfig } from '@/api/types/response';
import { useMedia } from '@/context/MediaContext';
import { BASE_URL } from '@/config';

const BANNER_KEYS = {
  INF00: 'HOME_BENEFIT_TITLE',
  INFO1: 'HOME_BENEFIT_1_TITLE',
  INFO2: 'HOME_BENEFIT_2_TITLE',
  INFO3: 'HOME_BENEFIT_3_TITLE',
  INFO4: 'HOME_BENEFIT_4_TITLE',
  INFO5: 'HOME_BENEFIT_5_TITLE',
  INFO11: 'HOME_BENEFIT_1_CONTENT',
  INFO12: 'HOME_BENEFIT_2_CONTENT',
  INFO13: 'HOME_BENEFIT_3_CONTENT',
  INFO14: 'HOME_BENEFIT_4_CONTENT',
  INFO15: 'HOME_BENEFIT_5_CONTENT',
  INF001: 'HOME_BENEFIT_1_IMAGE',
  INF002: 'HOME_BENEFIT_2_IMAGE',
  INF003: 'HOME_BENEFIT_3_IMAGE',
  INF004: 'HOME_BENEFIT_4_IMAGE',
  INF005: 'HOME_BENEFIT_5_IMAGE',
} as const;

const Holder = () => {
  const { i18n } = useClientTranslation();
  const mediaConfig = useMedia();
  const currentLang = i18n.language as keyof MediaConfig;
  const getLocalizedText = (code: string) => {
    return mediaConfig?.[code]?.[currentLang] ?? 'Loading...';
  };
  const getImageUrl = (imageUrl: string) => {
    console.log(mediaConfig?.[imageUrl].imageUrl, 'imageUrl');
    if (!mediaConfig || !mediaConfig[imageUrl]) {
      return '/sui-sui-logo.png';
    }
    return BASE_URL + (mediaConfig?.[imageUrl].imageUrl ?? '/sui-sui-logo.png');
  };
  const benefits = [
    {
      number: '01',
      title: getLocalizedText(BANNER_KEYS.INFO1),
      description: getLocalizedText(BANNER_KEYS.INFO11),
      icon: getImageUrl(BANNER_KEYS.INF001),
      numberIcon: '/home_number_icon1.png',
    },
    {
      number: '02',
      title: getLocalizedText(BANNER_KEYS.INFO2),
      description: getLocalizedText(BANNER_KEYS.INFO12),
      icon: getImageUrl(BANNER_KEYS.INF002),
      numberIcon: '/home_number_icon2.png',
    },
    {
      number: '03',
      title: getLocalizedText(BANNER_KEYS.INFO3),
      description: getLocalizedText(BANNER_KEYS.INFO13),
      icon: getImageUrl(BANNER_KEYS.INF003),
      numberIcon: '/home_number_icon3.png',
    },
    {
      number: '04',
      title: getLocalizedText(BANNER_KEYS.INFO4),
      description: getLocalizedText(BANNER_KEYS.INFO14),
      icon: getImageUrl(BANNER_KEYS.INF004),
      numberIcon: '/home_number_icon4.png',
    },
    {
      number: '05',
      title: getLocalizedText(BANNER_KEYS.INFO5),
      description: getLocalizedText(BANNER_KEYS.INFO15),
      icon: getImageUrl(BANNER_KEYS.INF005),
      numberIcon: '/home_number_icon5.png',
    },
  ];

  return (
    <div className="max-w-screen-xl flex flex-col items-start text-white mx-auto -mt-48 sm:mt-0 px-4">
      <h2 className="text-xl sm:text-6xl font-bold text-gradient mb-12">
        {getLocalizedText(BANNER_KEYS.INF00)}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {benefits &&
          benefits.map((benefit, index) => (
            <div
              key={index.toString()}
              className="flex flex-col sm:gap-1 bg-[url('/home_holder_card.png')] bg-[length:335px_257px] sm:bg-[length:402px_280px] bg-no-repeat text-white w-[335px] sm:w-[402px] h-[257px] sm:h-[280px] p-5 sm:p-6"
            >
              <div className="flex flex-row-reverse sm:mt-2">
                <Image
                  src={benefit.numberIcon}
                  alt="Icon"
                  width={60}
                  height={60}
                />
              </div>
              <div className="flex gap-4 mt-2 sm:mt-4 place-items-center">
                <div className="flex-none">
                  <Image src={benefit.icon} alt="Icon" width={40} height={40} />
                </div>
                <div className="sm:text-xl font-semibold">{benefit.title}</div>
              </div>
              <div className="text-xs sm:text-sm leading-relaxed mt-2">
                {benefit.description}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Holder;
