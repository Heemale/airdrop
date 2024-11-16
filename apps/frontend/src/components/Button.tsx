import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  text: string;
  className?: string;
  locale: string;
}

const Button = async (props: Props) => {
  const { locale, text, className } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div
      className={`${className} relative inline-block bg-[url('/button_bg.png')] bg-cover text-black font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer`}
    >
      {t(text)}
    </div>
  );
};

export default Button;
