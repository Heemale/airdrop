'use client';
import * as React from 'react';
import Banner from '@/components/Home/Banner';
import About from '@/components/Home/About';
import Holder from '@/components/Home/Holder';
import Link from 'next/link';
import { useClientTranslation } from '@/hook';



const Home = async () => {
  const { t } = useClientTranslation();

  return (
    <>
      <div className="bg-center bg-no-repeat flex flex-col gap-24 sm:gap-64 my-5">
        <div className="flex flex-col gap-24 sm:gap-48 items-center">
          <div className="flex flex-col gap-20 sm:gap-20">
            <Banner />
            <div className="bg-black bg-contain bg-no-repeat sm:bg-cover bg-right flex flex-col gap-6 sm:gap-12 mx-4 sm:mx-16 -mt-48 sm:mt-0">
              <Link href={'/presale'} className="flex justify-center">
                <button
                  className={`w-full sm:w-[600px] relative inline-block bg-gradient-to-r from-[#40cafd] to-[#1993ee] text-white font-bold text-center text-lg py-3 px-6 rounded-3xl shadow-3xl transition-transform transform active:scale-95 cursor-pointer`}
                >
                  {t('Equity subscription')}
                </button>
              </Link>
            </div>
            {/*<Sale locale={locale} />*/}
            {/*<Remain locale={locale} />*/}
            <About />
            <Holder  />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
