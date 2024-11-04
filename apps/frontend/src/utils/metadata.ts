export const metadataList = [
  {
    path: '/',
    en: {
      title: '',
      description: '',
      keysWords: '',
    },
    kr: {
      title: '',
      description: '',
      keysWords: '',
    },
    zh: {
      title: '',
      description: '',
      keysWords: '',
    },
  },
];

export const getMetaDataInfo = (path: string, locale: string) => {
  const allInfo = metadataList.find((e) => e.path === path) ?? metadataList[0];
  const langType = locale === 'zh' ? 'zh' : 'en';
  const metadataInfo = allInfo[langType];
  const baseUrl =
    process.env.NEXT_PUBLIC_METADATABASE ?? 'http://localhost:3000';
  return {
    title: metadataInfo.title,
    description: metadataInfo.description,
    keywords: metadataInfo.keysWords,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: metadataInfo.title,
      description: metadataInfo.description,
      images: '',
    },
    twitter: {
      card: '',
      title: metadataInfo.title,
      description: metadataInfo.description,
      images: '',
    },
  };
};
