import * as React from 'react';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';
import NodeData from '@/components/Presale/NodeData';
import Next from '@/components/Presale/Next';

interface Props {
  locale: string;
}

const NodeInfo = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <>
      <NodeData
        nodeInfo={t('Node Info')}
        nodeName={t('Node Name')}
        currentTier={t('Current Tier')}
        remainingAndTotalNodes={t('Remaining/Total Nodes')}
        allowedPurchaseAmount={t('Allowed Purchase Amount')}
        nodePrice={t('Node Price')}
      />
      <Next
        nextText={t('NEXT')}
        connectText={t('CONNECT WALLET')}
        bindText={t('BIND INVITER')}
        purchasedNodeText={t('PURCHASED NODE')}
      />
    </>
  );
};

export default NodeInfo;
