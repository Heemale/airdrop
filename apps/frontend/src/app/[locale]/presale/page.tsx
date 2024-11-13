import * as React from 'react';
import NavBar from '@/components/NavBar';
import PreSale from '@/components/Presale/PreSale';
import NodeInfo from '@/components/Presale/NodeInfo';
import initTranslations from '@/app/i18n';

const i18nNamespaces = ['common'];
const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const { t, resources } = await initTranslations(locale, i18nNamespaces);
  return (
    <>
      <NavBar />
      <PreSale translate={t}>
        <NodeInfo translate={t} />
      </PreSale>
    </>
  );
};

export default Home;
