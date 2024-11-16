import * as React from 'react';
import Image from 'next/image';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const About = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div className="max-w-screen-xl flex flex-col lg:flex-row items-center gap-10 px-4 text-white">
      <div className="flex-1 about-info">
        <h2 className="text-xl sm:text-6xl font-bold text-gradient">
          {t('About CoralApp')}
        </h2>
        <p className="mt-5 text-sm sm:text-lg leading-relaxed">
          {t(
            'CoralApp is a pioneering mobile ecosystem for multi-chain environmentswhich was admitted into Binance Labs Incubation. CoralApp recentlylaunched its first Web3 phone, the CoralApp. CoralApp features arevolutionary Coral OS + Mobile Stack, which optimizes Android OS andsmart devices from the ground up, creating a smoother entry point toWeb3 and strengthening the mobile infrastructure of the blockchainindustry',
          )}
        </p>
      </div>
      <div className="relative w-60 sm:w-96 about-img">
        <Image
          src="/home_banner2.gif" // 请替换为实际的图片路径
          alt="CoralApp Phone"
          width={320}
          height={640}
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default About;
