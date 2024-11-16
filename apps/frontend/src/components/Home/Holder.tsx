import * as React from 'react';
import Image from 'next/image';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const benefits = [
  {
    number: '',
    title: 'Diamond Hand Incentives',
    description:
      'The more and longer you hold, the more your points will add up, granting higher levels of benefits.',
    icon: '/home_icon1.png',
  },
  {
    number: '',
    title: 'Rights and interests of token exchange',
    description:
      'After the issuance of Coral Token, points can be exchanged for tokens to participate in the CoralApp ecosystem’s shared governance and token incentive programs.',
    icon: '/home_icon2.png',
  },
  {
    number: '',
    title: 'Partner Airdrops',
    description:
      'Join CoralApp and receive exclusive airdrop rewards from ecosystem partners.',
    icon: '/home_icon3.png',
  },
  {
    number: '',
    title: 'AI Intelligent Mining',
    description:
      'As a smart device, CoralPhone provides mining rewards and adds value to the device.',
    icon: '/home_icon4.png',
  },
  {
    number: '',
    title: 'Quality Project Airdrops',
    description:
      'Participate in CoralApp and have a chance to get airdrops from listing on top-tier exchanges and high-quality assets soon to be listed.',
    icon: '/home_icon5.png',
  },
];

const Holder = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <div className="max-w-screen-xl flex flex-col items-start text-white">
      <h2 className="text-5xl font-bold  text-gradient mb-12">
        {t('CoralPhone Holder Benefits')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 w-full">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="relative bg-gradient-to-b from-[#222] to-[#010101] text-white border-black border rounded-2xl w-[434px] h-[364px] p-6 text-left"
          >
            {/* 标号在右上角，部分超出盒子 */}
            <div className="absolute -top-4 right-3 flex items-center">
              <span className="text-7xl font-bold italic text-[#e2676f]">
                {index + 1}.{benefit.number}
              </span>
            </div>
            {/* 图标在左上角 */}
            <div className="absolute top-3 left-3">
              <Image src={benefit.icon} alt="Icon" width={50} height={50} />
            </div>
            <h3 className="text-lg font-semibold mt-20">{t(benefit.title)}</h3>
            <p className="text-sm leading-relaxed mt-2">
              {t(benefit.description)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Holder;
