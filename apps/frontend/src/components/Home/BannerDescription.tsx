import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const BannerDescription = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div className="w-3/4">
      <div className="sm:w-2/3 flex flex-col sm:gap-1 text-white text-sm sm:text-lg -mt-2">
        <div>
          {t('Data scale summary and forecast of decentralized sharing track')}
        </div>
        <div>
          {t(
            'With the rapid development of blockchain technology and the popularization of Web3.0 concepts, decentralized sharing economy has gradually become a hot track. In recent years, this field has achieved significant growth, and its market size and user base have shown a steady upward trend.',
          )}
        </div>
        <div>
          {t(
            'Market size growth: It is expected that by 2028, the market size of the decentralized sharing economy is expected to exceed the US$100 billion mark, and the average annual compound growth rate (CAGR) will remain between 20% and 25%. In the future, more and more traditional companies and investors will flock to this field, further promoting market development.',
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerDescription;
