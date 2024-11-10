import * as React from 'react';
import NavBar from '@/components/NavBar';
import PreSale from '@/components/Presale/PreSale';
import PurchaseOrder from '@/components/Presale/PurchaseOrder';

const Home = () => {
  return (
    <>
      <NavBar />
      <PreSale>
        <PurchaseOrder />
      </PreSale>
    </>
  );
};

export default Home;
