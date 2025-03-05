import Image from 'next/image';
import * as React from 'react';
import { useMedia } from '@/context/MediaContext';

import { BASE_URL } from '@/config';
const BANNER_KEYS = {
  INFO1: 'EVENT_ANNOUNCEMENT_IMAGE',
} as const;
const Banner = () => {
  const mediaConfig = useMedia();
  const getImageUrl = (imageUrl: string) => {
    console.log(mediaConfig?.[imageUrl].imageUrl, 'imageUrl');
    if (!mediaConfig || !mediaConfig[imageUrl]) {
      return '/sui-sui-logo.png';
    }
    return BASE_URL + (mediaConfig?.[imageUrl].imageUrl ?? '/sui-sui-logo.png');
  };

  return (
    <div className="w-[339px] sm:w-[720px]">
      <Image
        src={getImageUrl(BANNER_KEYS.INFO1)}
        width="720"
        height="720"
        alt="mceclip0"
      />
    </div>
  );
};

export default Banner;
