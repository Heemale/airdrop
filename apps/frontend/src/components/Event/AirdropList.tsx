'use client';

import * as React from 'react';
import AirdropItem from '@/components/Event/AirdropItem';
import { useEffect, useState } from 'react';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';
import { getCurrentTimestampMs } from '@/utils/time';
import { airdropClient, nodeClient } from '@/sdk';
import { AIRDROPS, NODES } from '@local/airdrop-sdk/utils';
import { message } from 'antd';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface Props {
  isOngoing?: boolean;
  ongoingText: string;
  chainText: string;
  totalCopies: string;
  rewardQuantityPerCopy: string;
  unpurchasedNode: string;
  claimText: string;
}

const startTime = BigInt(getCurrentTimestampMs());
const airdropData: Array<AirdropInfo> = [
  {
    round: BigInt(1),
    startTime: startTime, // 开始时间（当前时间戳）
    endTime: startTime + BigInt(3600), // 结束时间（1小时后）
    totalShares: BigInt(100), // 空投份额
    totalBalance: BigInt(10), // 总金额
    description: 'Example Airdrop 1', // 空投描述
    claimedShares: BigInt(0),
    coinType: '0x2::sui::SUI',
    isOpen: true,
  },
  {
    round: BigInt(2),
    startTime: startTime, // 开始时间（当前时间戳）
    endTime: startTime + BigInt(3600), // 结束时间（1小时后）
    totalShares: BigInt(100), // 空投份额
    totalBalance: BigInt(10), // 总金额
    description: 'Example Airdrop 2', // 空投描述
    claimedShares: BigInt(0),
    coinType: '0x2::sui::SUI',
    isOpen: true,
  },
];

const AirdropList = (props: Props) => {
  const {
    isOngoing,
    ongoingText,
    chainText,
    totalCopies,
    rewardQuantityPerCopy,
    unpurchasedNode,
    claimText,
  } = props;

  const account = useCurrentAccount();

  const [airdropList, setAirdropList] = useState<Array<AirdropInfo>>([]);
  const [isAlreadyBuyNode, setIsAlreadyBuyNode] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const getIsAlreadyBuyNode = async () => {
    if (account && account.address) {
      try {
        const user = account.address;
        const isAlreadyBuyNode = await nodeClient.isAlreadyBuyNode(NODES, user);
        setIsAlreadyBuyNode(isAlreadyBuyNode);
      } catch (e: any) {
        console.log(`getIsAlreadyBuyNode: ${e.message}`);
        messageApi.error(`Error: ${e.message}`);
      }
    }
  };

  const getAirdropList = async () => {
    try {
      const airdropData = await airdropClient.airdrops(AIRDROPS);
      console.log({ airdropData });
      setAirdropList(airdropData);
    } catch (e: any) {
      console.log(`getAirdropList error: ${e.messag}`);
      messageApi.error(`Error: ${e.message}`);
    }
  };

  useEffect(() => {
    getAirdropList();
    getIsAlreadyBuyNode();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {airdropList.map((item) => (
        <AirdropItem
          key={item.round.toString()}
          data={item}
          isOngoing={isOngoing}
          ongoingText={ongoingText}
          chainText={chainText}
          totalCopies={totalCopies}
          rewardQuantityPerCopy={rewardQuantityPerCopy}
          unpurchasedNode={unpurchasedNode}
          isAlreadyBuyNode={isAlreadyBuyNode}
          claimText={claimText}
        />
      ))}
      {contextHolder}
    </div>
  );
};

export default AirdropList;
