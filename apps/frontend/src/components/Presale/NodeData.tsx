'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { nodeClient } from '@/sdk';
import { NODES } from '@local/airdrop-sdk/utils/constants';
import { NodeInfo } from '@local/airdrop-sdk/node';

interface Props {
  nodeInfo: string;
  nodeName: string;
  nodeNameContent: string;
  currentTier: string;
  remainingAndTotalNodes: string;
  allowedPurchaseAmount: string;
  nodePrice: string;
}

const NodeData = (props: Props) => {
  const {
    nodeInfo,
    nodeName,
    nodeNameContent,
    currentTier,
    remainingAndTotalNodes,
    allowedPurchaseAmount,
    nodePrice,
  } = props;

  const [nodeList, setNodeList] = useState<Array<NodeInfo>>([]);
  const [index, setIndex] = useState<number>(0);

  const getNodeList = async () => {
    const nodes = await nodeClient.nodeList(NODES);
    setNodeList(nodes);
  };

  useEffect(() => {
    getNodeList();
  }, []);

  return (
    <>
      <div className="font-orbitron text-2xl">
        <div>{nodeInfo}</div>
      </div>
      <div className="flex justify-between">
        <div>{nodeName}</div>
        <div>{nodeNameContent}</div>
      </div>
      <div className="flex justify-between">
        <div>{currentTier}</div>
        <div>11</div>
      </div>
      <div className="flex justify-between">
        <div>{remainingAndTotalNodes}</div>
        <div>625/2033</div>
      </div>
      <div className="flex justify-between">
        <div>{allowedPurchaseAmount}</div>
        <div>0</div>
      </div>
      <div className="flex justify-between">
        <div>{nodePrice}</div>
        <div className="flex gap-0.5">
          <div>1</div>
          <div className="flex flex-col justify-end text-xs">Node</div>
          <div>=</div>
          <div>303</div>
          <div className="flex flex-col justify-end text-xs">USDC</div>
        </div>
      </div>
    </>
  );
};

export default NodeData;
