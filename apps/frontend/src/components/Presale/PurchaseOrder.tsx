import * as React from 'react';
import Link from 'next/link';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';
import PurchaseOrderData from '@/components/Presale/PurchaseOrderData';
import Purchase from '@/components/Presale/Purchase';

interface Props {
  locale: string;
}

const PurchaseOrder = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <>
      <PurchaseOrderData
        purchaseOrder={t('Purchase Order')}
        allowedPurchaseAmount={t('Allowed Purchase Amount')}
        quantity={t('Quantity')}
        estimatedCost={t('Estimated Cost')}
        priceDetail={t('Price Detail')}
        walletBalance={t('Wallet Balance')}
      />
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1">
          <Link href={'/presale'}>
            <div className="w-full relative inline-block bg-black text-white font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer border-gray-400 border">
              {t('Back')}
            </div>
          </Link>
        </div>
        <div className="col-span-2">
          <Purchase
            buyText={t('BUY')}
            connectText={t('CONNECT WALLET')}
            bindText={t('BIND INVITER')}
            purchasedNodeText={t('PURCHASED NODE')}
          />
        </div>
      </div>
    </>
  );
};

export default PurchaseOrder;
