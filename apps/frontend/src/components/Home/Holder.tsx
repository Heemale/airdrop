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
    title: 'Long-lasting and sustainable dividends',
    description:
      'The higher the equity status, the more creation equity you can own and the more sustainable dividends you will receive.',
    icon: '/home_icon1.png',
    numberIcon: '/home_number_icon1.png',
  },
  {
    number: '02',
    title: 'High-quality projects receive priority',
    description:
      'By participating in Mercury World, you will have the opportunity to obtain the IDO whitelist and priority airdrop rights for high-quality assets that will be launched soon, led by top venture capital institutions and leading exchanges.',
    icon: '/home_icon2.png',
    numberIcon: '/home_number_icon2.png',
  },
  {
    number: '03',
    title: 'A large number of ecological airdrops',
    description:
      'As long as you join Mercury World, you can receive a wide variety of potential project airdrop rewards.',
    icon: '/home_icon3.png',
    numberIcon: '/home_number_icon3.png',
  },
  {
    number: '04',
    title: 'Participation is mining',
    description:
      'Once you obtain the rights status of Mercury World, you can obtain the mining rewards of the platform. The higher the status, the more and continuous the rewards will be.',
    icon: '/home_icon4.png',
    numberIcon: '/home_number_icon4.png',
  },
  {
    number: '05',
    title: 'Obtain exclusive identity NFT',
    description:
      'Holding exclusive identity NFT, you can immediately share the markets continuous channel income. The higher the NFT level, you also have the right to propose, and receive bonuses and permanent dividends for proposal approval.',
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
        {t('Exclusive benefits for holding Mercury World rights and status')}
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
