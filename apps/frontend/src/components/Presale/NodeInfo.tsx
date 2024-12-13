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
      <NodeData
        nodeInfo={t('Equity Info')}
        nodeName={t('Equity Name')}
        currentTier={t('Current Tier')}
        remaining={t('Remaining Nodes')}
        allowedPurchaseAmount={t('Allowed Purchase Amount')}
        nodePrice={t('Equity Price')}
      />
      <Next
        nextText={t('NEXT')}
        connectText={t('CONNECT WALLET')}
        bindText={t('BIND INVITER')}
        purchasedNodeText={t('PURCHASED EQUITY')}
        transferText={t('TRANSFER EQUITY')}
      />
      {/*<TransferNode*/}
      {/*  transferText={t('TRANSFER EQUITY')}*/}
      {/*  connectText={t('CONNECT WALLET')}*/}
      {/*  placeholderText={t('Enter receiver is address')}*/}
      {/*/>*/}
    </>
  );
};

export default NodeInfo;
