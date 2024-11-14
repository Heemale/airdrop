import * as React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const PurchaseOrder = async (props: Props) => {
  const { locale } = props;
  const { t, resources } = await initTranslations(
    locale,
    i18nConfig.i18nNamespaces,
  );
  return (
    <>
      <div className="font-orbitron text-2xl">{t('Purchase Order')}</div>
      <div className="flex justify-between">
        <div>{t('Allowed Purchase Amount')}</div>
        <div>649</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Quantity')}</div>
        <div>1</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Estimated Cost')}</div>
        <div>272.7 USDT</div>
      </div>
      <div className="flex justify-between text-[#313131] text-sm">
        <div>{t('Price Detail')}: 1 x 272.7 USDT</div>
      </div>
      <div className="flex justify-between text-[#313131] text-sm">
        <div>{t('Wallet Balance')}: 19.409 USDT</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1">
          <Link href={'/presale'}>
            <div className="w-full relative inline-block bg-black text-white font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer border-gray-400 border">
              {t('Back')}
            </div>
          </Link>
        </div>
        <div className="col-span-2">
          <Button className="text-white w-full" text={t('Purchase')} />
        </div>
      </div>
    </>
  );
};

export default PurchaseOrder;
