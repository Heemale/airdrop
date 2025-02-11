'use client';

import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { NodeInfo } from '@local/airdrop-sdk/node';
import { Autocomplete, TextField } from '@mui/material';
import { nodeClientV2 } from '@/sdk';
import { NODES } from '@/sdk';
import { convertSmallToLarge } from '@/utils/math';
import { PresaleContext } from '@/context/PresaleContext';
import { message } from 'antd';
import { useClientTranslation } from '@/hook';

const NodeData = () => {
  const { t } = useClientTranslation();

  const { node, setNode } = useContext(PresaleContext);
  const [messageApi, contextHolder] = message.useMessage();

  const [nodeList, setNodeList] = useState<Array<NodeInfo>>([]);
  const defaultProps = {
    options: nodeList,
    getOptionLabel: (option: NodeInfo) => option.name,
  };

  const getNodeList = async () => {
    const nodes = await nodeClientV2.nodeList(NODES);
    setNodeList(nodes.filter((node) => node.isOpen));
  };

  useEffect(() => {
    getNodeList();
  }, []);

  return (
    <>
      <div className="font-bold text-gradient font-orbitron text-2xl">
        <div className="text-center sm:text-start">{t('Equity Info')}</div>
      </div>
      <div className="flex justify-between items-center gap-12">
        <div>{t('Equity Name')}</div>
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
                  backgroundColor: 'transparent', // 设置输入框背景为透明
                  height: '35px', // 保持输入框高度
                  '& .MuiInputBase-root': {
                    backgroundColor: 'transparent', // 内部元素也透明
                    height: '100%', // 确保填充整个高度
                    color: 'white', // 设置输入框内文字颜色
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'white', // 去掉边框颜色
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#40cafd', // 鼠标悬浮时边框颜色
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#40cafd', // 聚焦时边框颜色
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
              '@media (max-width: 640px)': {
                width: '200px', // 屏幕宽度小于 640px 时，宽度改为 200px
              },
              '& .MuiAutocomplete-endAdornment': {
                '& .MuiSvgIcon-root': {
                  color: 'white', // 设置下拉三角形为白色
                },
              },
            }}
            fullWidth={false} // 禁用默认的 fullWidth 以应用自定义宽度
          />
        </div>
      </div>
      <div className="flex justify-between">
        <div>{t('Current Tier')}</div>
        <div>LV {node ? node.rank : '-'}</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Remaining Nodes')}</div>
        <div>{node ? node.total_quantity - node.purchased_quantity : '-'}</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Allowed Purchase Amount')}</div>
        <div>1</div>
      </div>
      <div className="flex justify-between">
        <div>{t('Equity Price')}</div>
        <div className="flex gap-0.5">
          <div className="flex flex-col justify-end">
            {node ? convertSmallToLarge(node.price.toString(), 9) : '-'} SUI
          </div>
        </div>
      </div>
      {contextHolder}
    </>
  );
};

export default NodeData;
