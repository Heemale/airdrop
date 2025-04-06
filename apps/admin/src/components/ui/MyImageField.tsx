'use client';

import Image from 'next/image';
import { BASE_URL } from '@/config';
import Variants from '@/components/ui/Variants';
import * as React from 'react';
import { useState } from 'react';

interface props {
  isImage: boolean;
  imageUrl: string | null;
}

const getProcessedUrl = (imageUrl: string | null) => {
  if (!imageUrl) return '';

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/')) {
    return `${BASE_URL}${imageUrl}`;
  }

  return '';
};

const MyImageField = (props: props) => {
  const { isImage, imageUrl } = props;

  if (!isImage) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const processedUrl = getProcessedUrl(imageUrl);

  const handleImageError = () => {
    setIsError(true);
    setIsLoading(false);
  };

  const handleImageLoad = () => {
    setIsLoading(true);
  };

  const handleImageLoadingComplete = () => {
    setIsLoading(false);
  };

  if (!imageUrl || !imageUrl.startsWith('/')) {
    return <Variants />;
  }

  if (isLoading) {
    return <Variants />;
  }

  if (isError) {
    return <Variants />;
  }

  return (
    <div className="flex w-[200px] h-[200px] items-center">
      <Image
        src={processedUrl}
        alt="image"
        width={200}
        height={200}
        onError={handleImageError}
        onLoad={handleImageLoad}
        onLoadingComplete={handleImageLoadingComplete}
        style={{ objectFit: 'cover' }}
      />
    </div>
  );
};

export default MyImageField;
