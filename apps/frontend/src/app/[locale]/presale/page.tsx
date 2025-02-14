import * as React from 'react';
import NavBarWrapper from '@/components/NavBarWrapper';
import PreSale from '@/components/Presale/PreSale';
import NodeInfo from '@/components/Presale/NodeInfo';
import PurchaseHistory from '@/components/Presale/PurchaseHistory';

const Home = async () => {
  return (
    <div className="bg-[url('/presale_bg.jpg')] bg-cover bg-right sm:bg-center bg-no-repeat sm:h-[1080px]">
      <NavBarWrapper />
      <PreSale>
        <NodeInfo />
      </PreSale>
      <div className="max-w-4xl mx-auto mt-8 p-4">
        <PurchaseHistory />
      </div>
    </div>
  );
};

export default Home;
