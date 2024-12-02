import * as React from 'react';
import RemainText from '@/components/Home/RemainText';
import NumberPlate2 from '@/components/Home/NumberPlate2';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/app/i18n/i18nConfig';

interface Props {
  text: string;
  locale: string;
}

const RemainItem = async (props: Props) => {
  const { text, locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div className="sm:col-span-1 flex flex-col items-center gap-10 w-full">
      <RemainText text={text} translate={t} />
      <div className="flex gap-3 sm:gap-8 text-7xl sm:text-9xl font-bold italic">
        <NumberPlate2 num="-" />
        <NumberPlate2 num="-" />
      </div>
    </div>
  );
};

export default RemainItem;
