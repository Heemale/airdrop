import NavBar from '@/components/NavBar';
import Image from 'next/image';
import * as React from 'react';
import initTranslations from '@/app/i18n';

const i18nNamespaces = ['common'];

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <>
      <NavBar />
      <div className="bg-[url('/home_banner_bg.png')] bg-center bg-no-repeat flex flex-col gap-24 sm:gap-64 my-5">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="flex flex-col-reverse sm:flex-row justify-between mx-5 sm:mx-10 mt-10 sm:mt-24 gap-6">
            <div className="flex flex-col gap-6 sm:gap-12">
              <div className="text-gradient flex flex-col gap-1 sm:gap-2 text-white text-3xl sm:text-7xl font-semibold">
                <div>{t('Unlock Exclusive')}</div>
                <div>{t('Rewards with')}</div>
                <div>{t('CoralPhone')}</div>
              </div>
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
              <div className="hidden sm:flex">
                <Image
                  src="/home_binance.gif"
                  width="384"
                  height="111"
                  alt="home_binance"
                />
              </div>
              <div className="sm:hidden flex">
                <Image
                  src="/home_binance.gif"
                  width="200"
                  height="58"
                  alt="home_binance"
                />
              </div>
              <div className="flex items-center gap-4 sm:gap-10 mt-10">
                <div className="hidden sm:flex text-white font-semibold">
                  ————
                </div>
                <div className="sm:hidden flex text-gray-400 font-semibold">
                  ————
                </div>
                <div className="hidden sm:flex">
                  <Image
                    src="/home_banner_bottom.png"
                    width="64"
                    height="64"
                    alt="home_banner_bottom"
                  />
                </div>
                <div className="sm:hidden flex">
                  <Image
                    src="/home_banner_bottom.png"
                    width="24"
                    height="24"
                    alt="home_banner_bottom"
                  />
                </div>
              </div>
            </div>
            <div>
              <Image
                src="/home_banner.gif"
                width="600"
                height="600"
                alt="home_banner"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[url('/home_bg4.png')] bg-center bg-no-repeat flex flex-col gap-24 sm:gap-64 my-5">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="flex flex-col gap-8 sm:gap-20">
            <div className="flex flex-col gap-4 sm:gap-14 items-center mt-16 sm:mt-32">
              <div className="text-gradient text-xl sm:text-6xl font-semibold">
                Cumulative sales worldwide
              </div>
              <div className="flex gap-1 sm:gap-8 text-white text-3xl sm:text-9xl font-bold italic">
                <div className="flex flex-col justify-between w-[40px] sm:w-[144px] gap-0.5 sm:gap-1 relative">
                  <div className="bg-gradient-to-b from-[#010101] to-[#222] border-[#393838] border sm:border-2 rounded-t-xl sm:rounded-t-3xl h-[26px] sm:h-[93px]"></div>
                  <div className="bg-gradient-to-b from-[#222] to-[#010101] border-[#393838] border sm:border-2 rounded-b-xl sm:rounded-b-3xl h-[26px] sm:h-[93px]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    6
                  </div>
                </div>
                <div className="flex flex-col justify-between w-[40px] sm:w-[144px] gap-0.5 sm:gap-1 relative">
                  <div className="bg-gradient-to-b from-[#010101] to-[#222] border-[#393838] border sm:border-2 rounded-t-xl sm:rounded-t-3xl h-[26px] sm:h-[93px]"></div>
                  <div className="bg-gradient-to-b from-[#222] to-[#010101] border-[#393838] border sm:border-2 rounded-b-xl sm:rounded-b-3xl h-[26px] sm:h-[93px]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    0
                  </div>
                </div>
                <div className="flex flex-col justify-between w-[40px] sm:w-[144px] gap-0.5 sm:gap-1 relative">
                  <div className="bg-gradient-to-b from-[#010101] to-[#222] border-[#393838] border sm:border-2 rounded-t-xl sm:rounded-t-3xl h-[26px] sm:h-[93px]"></div>
                  <div className="bg-gradient-to-b from-[#222] to-[#010101] border-[#393838] border sm:border-2 rounded-b-xl sm:rounded-b-3xl h-[26px] sm:h-[93px]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    0
                  </div>
                </div>
                <div className="flex flex-col justify-between w-[40px] sm:w-[144px] gap-0.5 sm:gap-1 relative">
                  <div className="bg-gradient-to-b from-[#010101] to-[#222] border-[#393838] border sm:border-2 rounded-t-xl sm:rounded-t-3xl h-[26px] sm:h-[93px]"></div>
                  <div className="bg-gradient-to-b from-[#222] to-[#010101] border-[#393838] border sm:border-2 rounded-b-xl sm:rounded-b-3xl h-[26px] sm:h-[93px]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    0
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <div className="text-gradient sm:text-2xl font-semibold">
                  Data update:
                </div>
                <div className="text-white sm:text-2xl">
                  September 10, 24:00 UTC
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2 border-white border rounded-xl sm:rounded-2xl px-8 sm:px-10 py-1 sm:py-2">
                <div className="text-white sm:text-3xl font-semibold">
                  Alwaysround
                </div>
                <div className="text-gradient sm:text-3xl font-semibold">1</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="sm:col-span-1 flex flex-col items-center gap-10 w-full">
                <div className="bg-gradient-to-b from-[#222] to-[#010101] text-white text-sm sm:text-2xl border-black border rounded-2xl sm:px-12 py-2 sm:py-4 w-full text-center">
                  Quantity of units remaining for the current round
                </div>
                <div className="flex gap-3 sm:gap-8 text-7xl sm:text-9xl font-bold italic">
                  <div className="flex flex-col justify-between w-[64px] sm:w-[110px] gap-0.5 relative">
                    <div className="bg-gradient-to-b from-[#010101] to-[#222] border-gray-400 border-2 rounded-t-xl sm:rounded-t-3xl h-[40px] sm:h-[78px]"></div>
                    <div className="bg-gradient-to-b from-[#222] to-[#010101] border-gray-400 border-2 rounded-b-xl sm:rounded-b-3xl h-[40px] sm:h-[78px]"></div>
                    <div className="text-gradient absolute inset-0 flex justify-center">
                      -
                    </div>
                  </div>
                  <div className="flex flex-col justify-between w-[64px] sm:w-[110px] gap-0.5 relative">
                    <div className="bg-gradient-to-b from-[#010101] to-[#222] border-gray-400 border-2 rounded-t-xl sm:rounded-t-3xl h-[40px] sm:h-[78px]"></div>
                    <div className="bg-gradient-to-b from-[#222] to-[#010101] border-gray-400 border-2 rounded-b-xl sm:rounded-b-3xl h-[40px] sm:h-[78px]"></div>
                    <div className="text-gradient absolute inset-0 flex justify-center">
                      -
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:col-span-1 flex flex-col items-center gap-10 w-full">
                <div className="bg-gradient-to-b from-[#222] to-[#010101] text-white text-sm sm:text-2xl border-black border rounded-2xl sm:px-12 py-2 sm:py-4 w-full text-center">
                  Quantity sold during the current round
                </div>
                <div className="flex gap-3 sm:gap-8 text-7xl sm:text-9xl font-bold italic">
                  <div className="flex flex-col justify-between w-[64px] sm:w-[110px] gap-0.5 relative">
                    <div className="bg-gradient-to-b from-[#010101] to-[#222] border-gray-400 border-2 rounded-t-xl sm:rounded-t-3xl h-[40px] sm:h-[78px]"></div>
                    <div className="bg-gradient-to-b from-[#222] to-[#010101] border-gray-400 border-2 rounded-b-xl sm:rounded-b-3xl h-[40px] sm:h-[78px]"></div>
                    <div className="text-gradient absolute inset-0 flex justify-center">
                      -
                    </div>
                  </div>
                  <div className="flex flex-col justify-between w-[64px] sm:w-[110px] gap-0.5 relative">
                    <div className="bg-gradient-to-b from-[#010101] to-[#222] border-gray-400 border-2 rounded-t-xl sm:rounded-t-3xl h-[40px] sm:h-[78px]"></div>
                    <div className="bg-gradient-to-b from-[#222] to-[#010101] border-gray-400 border-2 rounded-b-xl sm:rounded-b-3xl h-[40px] sm:h-[78px]"></div>
                    <div className="text-gradient absolute inset-0 flex justify-center">
                      -
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
