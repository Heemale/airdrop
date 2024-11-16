import * as React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import initTranslations from '@/app/i18n';
import i18nConfig from '@/i18nConfig';

interface Props {
  locale: string;
}

const NodeInfo = async (props: Props) => {
  const { locale } = props;
  const { t } = await initTranslations(locale, i18nConfig.i18nNamespaces);

  return (
    <>
      <div className="font-orbitron text-2xl">
        <div>{t('Node Info')}</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Node Name')}</div>
        <div>{t('HyperFuse Guardian Node')}</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Current Tier')}</div>
        <div>11</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Remaining/Total Nodes')}</div>
        <div>625/2033</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Allowed Purchase Amount')}</div>
        <div>0</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Node Price')}</div>
        <div className="flex gap-0.5">
          <div>1</div>
          <div className="flex flex-col justify-end text-xs">Node</div>
          <div>=</div>
          <div>303</div>
          <div className="flex flex-col justify-end text-xs">USDC</div>
        </div>
      </div>
      <div>
        <Link href={'/presale-comfirm'}>
          <Button className="text-white w-full" text="Next" locale={locale} />
        </Link>
      </div>
    </>
  );
};

export default NodeInfo;
