import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const BuyNodeTitle = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div className="flex flex-col gap-8 sm:mt-10 mx-10">
      <div className="font-orbitron text-white text-2xl sm:text-5xl font-semibold">
        <div>{t('Buy Nodes')}</div>
      </div>
      <div className="font-orbitron text-gray-400 font-semibold">
        <div>{t('Public sale starts on')}</div> September 21, 09:00 PM
      </div>
    </div>
  );
};

export default BuyNodeTitle;
