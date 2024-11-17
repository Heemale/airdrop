import * as React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';
import NodeData from '@/components/Presale/NodeData';

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
        nodeNameContent={t('HyperFuse Guardian Node')}
        currentTier={t('Current Tier')}
        remainingAndTotalNodes={t('Remaining/Total Nodes')}
        allowedPurchaseAmount={t('Allowed Purchase Amount')}
        nodePrice={t('Node Price')}
      />
      <div>
        <Link href={'/presale-comfirm'}>
          <Button className="text-white w-full" text="Next" locale={locale} />
        </Link>
      </div>
    </>
  );
};

export default NodeInfo;
