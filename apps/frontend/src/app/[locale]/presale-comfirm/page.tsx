import * as React from 'react';
import NavBar from '@/components/NavBar';
import PreSale from '@/components/Presale/PreSale';
import PurchaseOrder from '@/components/Presale/PurchaseOrder';

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  return (
    <>
      <NavBar locale={locale} />
      <PreSale locale={locale}>
        <PurchaseOrder locale={locale} />
      </PreSale>
    </>
  );
};

export default Home;
