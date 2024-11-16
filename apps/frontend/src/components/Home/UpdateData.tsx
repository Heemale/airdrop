import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const UpdateData = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div className="flex gap-2 mt-6">
      <div className="text-gradient sm:text-2xl font-semibold">
        <div>{t('Data update:')}</div>
      </div>
      <div className="text-white sm:text-2xl">
        <div>{t('September 10, 24:00 UTC')}</div>
      </div>
    </div>
  );
};

export default UpdateData;
