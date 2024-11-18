'use client';

import * as React from 'react';

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

  return (
    <>
      <div className="font-orbitron text-2xl">{purchaseOrder}</div>
      <div className="flex justify-between">
        <div>{allowedPurchaseAmount}</div>
        <div>649</div>
      </div>
      <div className="flex justify-between">
        <div>{quantity}</div>
        <div>1</div>
      </div>
      <div className="flex justify-between">
        <div>{estimatedCost}</div>
        <div>272.7 USDT</div>
      </div>
      <div className="flex justify-between text-[#313131] text-sm">
        <div>{priceDetail}: 1 x 272.7 USDT</div>
      </div>
      <div className="flex justify-between text-[#313131] text-sm">
        <div>{walletBalance}: 19.409 USDT</div>
      </div>
    </>
  );
};

export default PurchaseOrderData;
