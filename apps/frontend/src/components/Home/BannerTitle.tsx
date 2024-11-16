import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const BannerTitle = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div className="text-gradient flex flex-col gap-1 sm:gap-2 text-white text-3xl sm:text-7xl font-semibold">
      <div>{t('Unlock Exclusive')}</div>
      <div>{t('Rewards with')}</div>
      <div>{t('CoralPhone')}</div>
    </div>
  );
};

export default BannerTitle;
