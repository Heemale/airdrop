'use client';

import * as React from 'react';
import AirdropItem from '@/components/Event/AirdropItem';
import { useEffect, useState } from 'react';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';
import { getCurrentTimestampMs } from '@/utils/time';
import { airdropClient } from '@/sdk';
import { AIRDROPS } from '@local/airdrop-sdk/utils';
import { message } from 'antd';

interface Props {
  isOngoing?: boolean;
  ongoingText: string;
  chainText: string;
  totalCopies: string;
  rewardQuantityPerCopy: string;
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
  } = props;

  const [airdropList, setAirdropList] = useState<Array<AirdropInfo>>([]);
  const [messageApi, contextHolder] = message.useMessage();

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
        />
      ))}
      {contextHolder}
    </div>
  );
};

export default AirdropList;
