import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';
import NodeData from '@/components/Presale/NodeData';
import Next from '@/components/Presale/Next';
import TransferNode from './TransferNode';

interface Props {
  locale: string;
}

const NodeInfo = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <>
      <NodeData />
      <Next />
      {/*<TransferNode*/}
      {/*  transferText={t('TRANSFER EQUITY')}*/}
      {/*  connectText={t('CONNECT WALLET')}*/}
      {/*  placeholderText={t('Enter receiver is address')}*/}
      {/*/>*/}
    </>
  );
};

export default NodeInfo;
