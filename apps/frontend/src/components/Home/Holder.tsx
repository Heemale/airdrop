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
    numberIcon: '/home_number_icon1.png',
  },
  {
    number: '02',
    title: 'Rights and interests of token exchange',
    description:
      'After the issuance of Coral Token, points can be exchanged for tokens to participate in the CoralApp ecosystem’s shared governance and token incentive programs.',
    icon: '/home_icon2.png',
    numberIcon: '/home_number_icon2.png',
  },
  {
    number: '03',
    title: 'Partner Airdrops',
    description:
      'Join CoralApp and receive exclusive airdrop rewards from ecosystem partners.',
    icon: '/home_icon3.png',
    numberIcon: '/home_number_icon3.png',
  },
  {
    number: '04',
    title: 'AI Intelligent Mining',
    description:
      'As a smart device, CoralPhone provides mining rewards and adds value to the device.',
    icon: '/home_icon4.png',
    numberIcon: '/home_number_icon4.png',
  },
  {
    number: '05',
    title: 'Quality Project Airdrops',
    description:
      'Participate in CoralApp and have a chance to get airdrops from listing on top-tier exchanges and high-quality assets soon to be listed.',
    icon: '/home_icon5.png',
    numberIcon: '/home_number_icon5.png',
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {benefits &&
          benefits.map((benefit, index) => (
            <div
              key={index.toString()}
              className="flex flex-col sm:gap-1 bg-[url('/home_holder_card.png')] bg-contain bg-no-repeat text-white w-[335px] sm:w-[402px] h-[257px] p-5 sm:p-6"
            >
              <div className="flex flex-row-reverse sm:mt-2">
                <Image
                  src={benefit.numberIcon}
                  alt="Icon"
                  width={60}
                  height={60}
                />
              </div>
              <div className="flex gap-4 mt-2 sm:mt-4 place-items-center">
                <div className="flex-none">
                  <Image src={benefit.icon} alt="Icon" width={40} height={40} />
                </div>
                <div className="sm:text-xl font-semibold">
                  {t(benefit.title)}
                </div>
              </div>
              <div className="text-xs sm:text-sm leading-relaxed mt-2">
                {t(benefit.description)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Holder;
