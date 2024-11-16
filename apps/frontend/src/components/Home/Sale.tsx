import NumberPlate from '@/components/Home/NumberPlate';
import UpdateData from '@/components/Home/UpdateData';
import Always from '@/components/Home/Always';
import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const Sale = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div className="flex flex-col gap-4 sm:gap-14 items-center mt-16 sm:mt-32">
      <div className="text-gradient text-xl sm:text-6xl font-semibold">
        <div>{t('Cumulative sales worldwide')}</div>
      </div>
      <div className="flex gap-1 sm:gap-8 text-white text-3xl sm:text-9xl font-bold italic">
        <NumberPlate num={6} />
        <NumberPlate num={0} />
        <NumberPlate num={0} />
        <NumberPlate num={0} />
      </div>
      <UpdateData locale={locale} />
      <Always />
    </div>
  );
};

export default Sale;
