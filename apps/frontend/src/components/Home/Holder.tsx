import * as React from 'react';
import Image from 'next/image';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const benefits = [
  {
    number: '01',
    title: 'Diamond Hand Incentives',
    description:
      'The more and longer you hold, the more your points will add up, granting higher levels of benefits.',
    icon: '/home_icon1.png',
  },
  {
    number: '02',
    title: 'Rights and interests of token exchange',
    description:
      'After the issuance of Coral Token, points can be exchanged for tokens to participate in the CoralApp ecosystem’s shared governance and token incentive programs.',
    icon: '/home_icon2.png',
  },
  {
    number: '03',
    title: 'Partner Airdrops',
    description:
      'Join CoralApp and receive exclusive airdrop rewards from ecosystem partners.',
    icon: '/home_icon3.png',
  },
  {
    number: '04',
    title: 'AI Intelligent Mining',
    description:
      'As a smart device, CoralPhone provides mining rewards and adds value to the device.',
    icon: '/home_icon4.png',
  },
  {
    number: '05',
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
    <div className="max-w-screen-xl flex flex-col items-start text-white mx-auto">
      <h2 className="text-xl sm:text-6xl font-bold text-gradient mb-12">
        {t('CoralPhone Holder Benefits')}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 w-full">
        {benefits &&
          benefits.map((benefit, index) => (
            <div
              key={index.toString()}
              className="relative bg-gradient-to-b from-[#222] to-[#010101] text-white border-black border rounded-2xl w-[335px] sm:w-[434px] h-[257px] sm:h-[364px] p-6 text-left"
            >
              {/* 标号在右上角，部分超出盒子 */}
              <div className="absolute -top-4 right-0 flex items-center">
                <span className="text-7xl font-bold italic text-gradient">
                  {benefit.number}
                </span>
              </div>
              {/* 图标在左上角 */}
              <div className="absolute top-6 left-6">
                <Image src={benefit.icon} alt="Icon" width={50} height={50} />
              </div>
              <h3 className="text-lg font-semibold mt-20">
                {index + 1}.{t(benefit.title)}
              </h3>
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
