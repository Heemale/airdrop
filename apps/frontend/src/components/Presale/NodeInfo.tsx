import * as React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';

const NodeInfo = () => {
  return (
    <>
      <div className="font-orbitron text-2xl">Node Info</div>
      <div className="flex justify-between">
        <div>Node Name</div>
        <div>HyperFuse Guardian Node</div>
      </div>
      <div className="flex justify-between">
        <div>Current Tier</div>
        <div>11</div>
      </div>
      <div className="flex justify-between">
        <div>Remaining/Total Nodes</div>
        <div>625/2033</div>
      </div>
      <div className="flex justify-between">
        <div>Allowed Purchase Amount</div>
        <div>0</div>
      </div>
      <div className="flex justify-between">
        <div>Node Price</div>
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
          <Button className="text-white w-full" text="Next" />
        </Link>
      </div>
    </>
  );
};

export default NodeInfo;
