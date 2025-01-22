'use client';

import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { PresaleContext } from '@/context/PresaleContext';
import { convertSmallToLarge } from '@/utils/math';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { suiClient } from '@/sdk';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { useClientTranslation } from '@/hook';
import { handleTxError } from '@/sdk/error';
import { PAY_COIN_TYPE } from '@local/airdrop-sdk/utils';

const PurchaseOrderData = () => {
  const { t } = useClientTranslation();

  const router = useRouter();
  const account = useCurrentAccount();
  const { node } = useContext(PresaleContext);
  const [balance, setBalance] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const getBalance = async () => {
    if (account && account.address) {
      try {
        const res = await suiClient.getBalance({
          owner: account.address,
          coinType: PAY_COIN_TYPE,
        });
        setBalance(res.totalBalance);
      } catch (e: any) {
        console.log(`getBalance: ${e.message}`);
        messageApi.error(`${t(handleTxError(e.message))}`);
      }
    }
  };

  useEffect(() => {
    getBalance();
  }, [account]);

  useEffect(() => {
    if (!node) {
      router.push('/presale');
    }
  }, [node]);

  return (
    <>
      <div className="font-orbitron text-2xl">{t('Purchase Order')}</div>
      <div className="flex justify-between">
        <div>{t('Allowed Purchase Amount')}</div>
        <div>1</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Quantity')}</div>
        <div>1</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Estimated Cost')}</div>
        <div>
          {node ? convertSmallToLarge(node.price.toString(), 9) : '-'} SUI
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <div>
          {t('Price Detail')}:
          {node ? '1 x ' + convertSmallToLarge(node.price.toString(), 9) : '-'}{' '}
          SUI
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <div>
          {t('Wallet Balance')}:{' '}
          {balance ? convertSmallToLarge(balance, 9) : '-'} SUI
        </div>
      </div>
      {contextHolder}
    </>
  );
};

export default PurchaseOrderData;
