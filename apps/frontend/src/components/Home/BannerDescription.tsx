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
    <>
      <div className="hidden sm:flex flex-col sm:gap-1 text-white text-lg">
        <div>
          {t(
            'CoralPhone maximizes your advantages through a series of exclusive rewards',
          )}
        </div>
        <div>
          {t(
            'designed to enhance your Web3 experience. From airdrops to passive income,',
          )}
        </div>
        <div>
          {t(
            'CoralPhone users can enjoy unique benefits tailored to promote the Web3 lifestyle.',
          )}
        </div>
      </div>
      <div className="sm:hidden flex flex-col sm:gap-1 text-white text-sm sm:text-lg">
        <div>
          {t(
            'CoralPhone maximizes your advantages through a series of exclusive rewards designed to enhance your Web3 experience. From airdrops to passive income, CoralPhone users can enjoy unique benefits tailored to promote the Web3 lifestyle.',
          )}
        </div>
      </div>
    </>
  );
};

export default BannerDescription;
