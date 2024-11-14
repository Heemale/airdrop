import * as React from 'react';
import NavBar from '@/components/NavBar';
import PreSale from '@/components/Presale/PreSale';
import NodeInfo from '@/components/Presale/NodeInfo';

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  return (
    <>
      <NavBar />
      <PreSale locale={locale}>
        <NodeInfo locale={locale} />
      </PreSale>
    </>
  );
};

export default Home;
