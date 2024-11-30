'use client';

import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { NodeInfo } from '@local/airdrop-sdk/node';
import { Autocomplete, TextField } from '@mui/material';
import { nodeClient } from '@/sdk';
import { NODES } from '@local/airdrop-sdk/utils';
import { convertSmallToLarge } from '@/utils/math';
import { PresaleContext } from '@/context/PresaleContext';
import { message } from 'antd';

interface Props {
  nodeInfo: string;
  nodeName: string;
  currentTier: string;
  remainingAndTotalNodes: string;
  allowedPurchaseAmount: string;
  nodePrice: string;
}

const nodes = [
  {
    rank: 1,
    name: 'node 1',
    description: 'node 1 description',
    limit: BigInt(1),
    price: BigInt(1000000000),
    total_quantity: BigInt(100),
    purchased_quantity: BigInt(1),
  },
  {
    rank: 2,
    name: 'node 2',
    description: 'node 2 description',
    limit: BigInt(2),
    price: BigInt(20000000),
    total_quantity: BigInt(200),
    purchased_quantity: BigInt(2),
  },
];

const NodeData = (props: Props) => {
  const {
    nodeInfo,
    nodeName,
    currentTier,
    remainingAndTotalNodes,
    allowedPurchaseAmount,
    nodePrice,
  } = props;

  const { node, setNode } = useContext(PresaleContext);
  const [messageApi, contextHolder] = message.useMessage();

  const [nodeList, setNodeList] = useState<Array<NodeInfo>>([]);
  const defaultProps = {
    options: nodeList,
    getOptionLabel: (option: NodeInfo) => option.name,
  };

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
      <div className="flex justify-between items-center gap-12">
        <div>{nodeName}</div>
        <div>
          <Autocomplete
            {...defaultProps}
            id="controlled-demo"
            value={node}
            onChange={(event: any, newValue: NodeInfo | null) => {
              setNode(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{
                  backgroundColor: 'white', // 设置背景色为白色
                  height: '35px', // 设置高度为 35px
                  '& .MuiInputBase-root': {
                    height: '100%', // 确保输入框内部元素填充整个高度
                  },
                }}
              />
            )}
            sx={{
              width: '300px', // 设置宽度为 300px
              height: '35px', // 设置高度为 35px
              '& .MuiAutocomplete-listbox': {
                backgroundColor: 'white', // 设置下拉框的背景色
                color: 'black', // 设置下拉项的文字颜色
              },
              '& .MuiAutocomplete-option': {
                '&:hover': {
                  backgroundColor: 'lightgray', // 设置悬浮时的背景色
                },
              },
            }}
            fullWidth={false} // 禁用默认的 fullWidth 以应用自定义宽度
          />
        </div>
      </div>
      <div className="flex justify-between">
        <div>{currentTier}</div>
        <div>{node ? node.rank : '-'}</div>
      </div>
      <div className="flex justify-between">
        <div>{remainingAndTotalNodes}</div>
        <div>
          {node ? node.total_quantity - node.purchased_quantity : '-'}/
          {node ? node.total_quantity : '-'}
        </div>
      </div>
      <div className="flex justify-between">
        <div>{allowedPurchaseAmount}</div>
        <div>1</div>
      </div>
      <div className="flex justify-between">
        <div>{nodePrice}</div>
        <div className="flex gap-0.5">
          <div>1</div>
          <div className="flex flex-col justify-end text-xs">Node</div>
          <div>=</div>
          <div>
            {node ? convertSmallToLarge(node.price.toString(), 9) : '-'}
          </div>
          <div className="flex flex-col justify-end text-xs">USDT</div>
        </div>
      </div>
      {contextHolder}
    </>
  );
};

export default NodeData;
