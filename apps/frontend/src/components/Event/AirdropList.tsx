'use client';

import * as React from 'react';
import AirdropItem from '@/components/Event/AirdropItem';
import { useEffect, useState } from 'react';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';

interface Props {
  locale: string;
}

// 创建硬编码的空投数据
const startTime = BigInt(Math.floor(Date.now() / 1000));
const airdropData = [
  {
    round: BigInt(1),
    startTime: startTime, // 开始时间（当前时间戳）
    endTime: startTime + BigInt(3600), // 结束时间（1小时后）
    totalShares: BigInt(100), // 空投份额
    totalBalance: BigInt(10), // 总金额
    description: 'Example Airdrop2', // 空投描述
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
    description: 'Example Airdrop1', // 空投描述
    claimedShares: BigInt(0),
    coinType: '0x2::sui::SUI',
    isOpen: true,
  },
];

const AirdropList = (props: Props) => {
  const { locale } = props;

  // 定义 state 用于存储空投列表
  const [airdropList, setAirdropList] = useState<Array<AirdropInfo>>([]);

  // 模拟获取空投数据的函数
  const getAirdropList = () => {
    console.log('Hardcoded airdrop data:', airdropData);
    setAirdropList(airdropData);
  };

  // 在组件挂载时调用
  useEffect(() => {
    getAirdropList();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {airdropList.map((item) => (
        <AirdropItem key={item.round.toString()} data={item} locale={locale} />
      ))}
    </div>
  );
};

export default AirdropList;

// const AirdropList = (props: Props) => {
// const [airdropList, setAirdropList] = useState<Array<AirdropInfo>>([]);

// const getAirdropList = async () => {
//   const currentTime = Date.now();
//   const airdrops = await airdropClient.airdrops(AIRDROPS);
//   console.log('Before filtering:', airdrops); // 打印过滤前的 airdrops
//   const filteredAirdrops = airdrops.filter(
//     (item) =>
//       item.isOpen === true &&
//       currentTime >= Number(item.startTime) &&
//       currentTime <= Number(item.endTime),
//   );
//   setAirdropList(filteredAirdrops);
//   console.log('After filtering:', filteredAirdrops); // 打印过滤后的 airdrops
// };
// useEffect(() => {
//   getAirdropList();
// }, []);
