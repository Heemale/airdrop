import * as React from 'react';
import NavBarWrapper from '@/components/NavBarWrapper';
import PreSale from '@/components/Presale/PreSale';
import NodeInfo from '@/components/Presale/NodeInfo';
import Purchasehistory from '@/components/Presale/Purchasehistory';
interface Props {
  params: Promise<{ locale: string }>;
}

const Home = async (props: Props) => {
  const { params } = props;
  const { locale } = await params;

  return (
    <>
      <div className="bg-[url('/presale_bg.jpg')] bg-cover bg-right sm:bg-center bg-no-repeat sm:h-[1080px]">
        <NavBarWrapper locale={locale} />
        <PreSale>
          <NodeInfo locale={locale} />
        </PreSale>

        <div className="max-w-4xl mx-auto mt-8 p-4">
          <Purchasehistory />
        </div>
      </div>
    </>
  );
};

export default Home;
