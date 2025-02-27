'use client';

import * as React from 'react';
import AirdropItem from '@/components/Event/AirdropItem';
import { useEffect, useState } from 'react';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';
import { getCurrentTimestampMs } from '@/utils/time';
import { airdropClient, nodeClient } from '@/sdk';
import { AIRDROPS, NODES } from '@/sdk/constants';
import { message } from 'antd';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { handleTxError } from '@/sdk/error';
import { useClientTranslation } from '@/hook';
import { NodeStatus } from '@local/airdrop-sdk/node';
import { getAirdropInfo } from '@/api';

interface Props {
  isOngoing?: boolean;
  ongoingText: string;
  chainText: string;
  totalCopies: string;
  rewardQuantityPerCopy: string;
  claimText: string;
}

const checkIsGoing = (startTime: bigint, endTime: bigint): boolean => {
  const timestampMs = getCurrentTimestampMs();
  return timestampMs >= startTime && timestampMs <= endTime;
};

const AirdropList = (props: Props) => {
  const {
    isOngoing,
    ongoingText,
    chainText,
    totalCopies,
    rewardQuantityPerCopy,
    claimText,
  } = props;

  const { t } = useClientTranslation();
  const account = useCurrentAccount();
  const [messageApi, contextHolder] = message.useMessage();

  const [airdropList, setAirdropList] = useState<Array<AirdropInfo>>([]);
  const [nodeStatus, setNodeStatus] = useState<NodeStatus | null>(null);

  const getNodeStatus = async () => {
    if (!account) return;

    try {
      const nodeStatus = await nodeClient.getNodeStatus(NODES, account.address);
      setNodeStatus(nodeStatus);
    } catch (e: any) {
      console.log(`getNodeStatus: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message))}`);
    }
  };

  const getAirdropList = async () => {
    try {
      const airdrops = await getAirdropInfo(); // 获取空投信息
      if (Array.isArray(airdrops)) {
        console.log('Received airdrop list:', airdrops);

        // 确保返回值是数组，遍历数据并格式化
        const formattedAirdropList: AirdropInfo[] = airdrops.map((airdrop) => ({
          round: BigInt(airdrop.round), // 确保是 BigInt 类型
          startTime: BigInt(airdrop.startTime),
          endTime: BigInt(airdrop.endTime),
          totalShares: BigInt(airdrop.totalShares),
          claimedShares: BigInt(airdrop.claimedShares),
          totalBalance: BigInt(airdrop.totalBalance),
          isOpen: airdrop.isOpen,
          description: airdrop.description,
          image_url: airdrop.image_url,
          coinType: airdrop.coinType,
          remaining_balance: BigInt(airdrop.remaining_balance),
        }));

        console.log('Formatted airdrop list:', formattedAirdropList);
        setAirdropList(formattedAirdropList); // 只保留开启的空投
      } else {
        // 如果返回的是单个空投，直接处理
        const airdrop = airdrops; // 假设 response 是单个空投
        const formattedAirdrop: AirdropInfo = {
          round: BigInt(airdrop.round),
          startTime: BigInt(airdrop.startTime),
          endTime: BigInt(airdrop.endTime),
          totalShares: BigInt(airdrop.totalShares),
          claimedShares: BigInt(airdrop.claimedShares),
          totalBalance: BigInt(airdrop.totalBalance),
          isOpen: airdrop.isOpen,
          description: airdrop.description,
          image_url: airdrop.image_url,
          coinType: airdrop.coinType,
          remaining_balance: BigInt(airdrop.remaining_balance),
        };
        console.log('Formatted single airdrop:', formattedAirdrop);

        setAirdropList([formattedAirdrop]); // 将单个空投包装成数组并更新状态
      }
    } catch (e: any) {
      console.log(`getAirdropList: ${e.message}`);
      // 处理错误并显示提示
      messageApi.error(`${t(handleTxError(e.message))}`);
    }
  };
  useEffect(() => {
    getNodeStatus();
  }, [account]);

  useEffect(() => {
    getAirdropList();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {isOngoing
        ? airdropList
            .filter(
              (item) =>
                item.isOpen && checkIsGoing(item.startTime, item.endTime),
            )
            .sort((a, b) => (b.round > a.round ? 1 : -1)) // 按照 round 从大到小排序
            .map((item) => (
              <AirdropItem
                key={item.round.toString()}
                data={item}
                isOngoing={true}
                ongoingText={ongoingText}
                chainText={chainText}
                totalCopies={totalCopies}
                rewardQuantityPerCopy={rewardQuantityPerCopy}
                nodeStatus={nodeStatus}
                claimText={claimText}
              />
            ))
        : airdropList
            .filter((item) => item.isOpen)
            .sort((a, b) => (b.round > a.round ? 1 : -1)) // 按照 round 从大到小排序
            .map((item) => {
              const isOngoing = checkIsGoing(item.startTime, item.endTime);
              return (
                <AirdropItem
                  key={item.round.toString()}
                  data={item}
                  isOngoing={isOngoing}
                  ongoingText={ongoingText}
                  chainText={chainText}
                  totalCopies={totalCopies}
                  rewardQuantityPerCopy={rewardQuantityPerCopy}
                  nodeStatus={nodeStatus}
                  claimText={claimText}
                />
              );
            })}
      {contextHolder}
    </div>
  );
};

export default AirdropList;
