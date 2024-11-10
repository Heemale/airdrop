import * as React from 'react';
import NavBar from '@/components/NavBar';
import PreSale from '@/components/Presale/PreSale';
import NodeInfo from '@/components/Presale/NodeInfo';

const Home = () => {
  return (
    <>
      <NavBar />
      <PreSale>
        <NodeInfo />
      </PreSale>
    </>
  );
};

export default Home;
