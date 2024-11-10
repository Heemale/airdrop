import * as React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';

const PurchaseOrder = () => {
  return (
    <>
      <div className="font-orbitron text-2xl">Purchase Order</div>
      <div className="flex justify-between">
        <div>Allowed Purchase Amount</div>
        <div>649</div>
      </div>
      <div className="flex justify-between">
        <div>Quantity</div>
        <div>1</div>
      </div>
      <div className="flex justify-between">
        <div>Estimated Cost</div>
        <div>272.7 USDT</div>
      </div>
      <div className="flex justify-between text-[#313131] text-sm">
        <div>Price Detail: 1 x 272.7 USDT</div>
      </div>
      <div className="flex justify-between text-[#313131] text-sm">
        <div>Wallet Balance: 19.409 USDT</div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1">
          <Link href={'/presale'}>
            <div className="w-full relative inline-block bg-black text-white font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer border-gray-400 border">
              Back
            </div>
          </Link>
        </div>
        <div className="col-span-2">
          <Button className="text-white w-full" text="Purchase" />
        </div>
      </div>
    </>
  );
};

export default PurchaseOrder;
