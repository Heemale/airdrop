import BuyNodeTitle from '@/components/Presale/BuyNodeTitle';
import Image from 'next/image';
import * as React from 'react';
import initTranslations from '@/app/i18n';

const i18nNamespaces = ['common'];
const PreSale = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <div className="flex flex-col gap-24 sm:gap-64 sm:my-5">
      <div className="flex flex-col gap-24 sm:gap-48 items-center">
        <div className="flex flex-col gap-8 sm:gap-20">
          <BuyNodeTitle translate={t} />
          <div className="flex flex-col sm:flex-row justify-between mx-10">
            <div className="w-[343px] sm:w-[800px]">
              <Image
                src="/sonic-hyperfuse.png"
                width="800"
                height="450"
                alt="sonic-hyperfuse"
              />
            </div>
            <div className="font-manrope flex flex-col justify-center gap-4 text-white sm:w-[456px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreSale;
