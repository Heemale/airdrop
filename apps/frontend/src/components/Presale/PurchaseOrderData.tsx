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

interface Props {
  purchaseOrder: string;
  allowedPurchaseAmount: string;
  quantity: string;
  estimatedCost: string;
  priceDetail: string;
  walletBalance: string;
}

const PurchaseOrderData = (props: Props) => {
  const {
    purchaseOrder,
    allowedPurchaseAmount,
    quantity,
    estimatedCost,
    priceDetail,
    walletBalance,
  } = props;
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
          coinType: '0x2::sui::SUI',
        });
        setBalance(res.totalBalance);
      } catch (e: any) {
        console.log(`getBalance: ${e.message}`);
        messageApi.error(`Error: ${t(handleTxError(e.message))}`);
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
      <div className="font-orbitron text-2xl">{purchaseOrder}</div>
      <div className="flex justify-between">
        <div>{allowedPurchaseAmount}</div>
        <div>1</div>
      </div>
      <div className="flex justify-between">
        <div>{quantity}</div>
        <div>1</div>
      </div>
      <div className="flex justify-between">
        <div>{estimatedCost}</div>
        <div>
          {node ? convertSmallToLarge(node.price.toString(), 9) : '-'} USDT
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <div>
          {priceDetail}:
          {node ? '1 x ' + convertSmallToLarge(node.price.toString(), 9) : '-'}{' '}
          USDT
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <div>
          {walletBalance}: {balance ? convertSmallToLarge(balance, 9) : '-'}{' '}
          USDT
        </div>
      </div>
      {contextHolder}
    </>
  );
};

export default PurchaseOrderData;
