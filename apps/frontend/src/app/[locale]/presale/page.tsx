import * as React from 'react';
import NavBarWrapper from '@/components/NavBarWrapper';
import PreSale from '@/components/Presale/PreSale';
import NodeInfo from '@/components/Presale/NodeInfo';

interface Props {
  params: Promise<{ locale: string }>;
}

const Home = async (props: Props) => {
  const { params } = props;
  const { locale } = await params;

  return (
    <>
      <NavBarWrapper locale={locale} />
      <PreSale locale={locale}>
        <NodeInfo locale={locale} />
      </PreSale>
    </>
  );
};

export default Home;
