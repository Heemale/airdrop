'use client';
import * as React from 'react';
import AirdropItem from '@/components/Event/AirdropItem';
import { useEffect, useState } from 'react';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';
import { airdropClient } from '@/sdk';
import { AIRDROPS } from '@local/airdrop-sdk/utils';

interface Props {
  locale: string;
}
const AirdropList = (props: Props) => {
  const { locale } = props;

  const [airdropList, setAirdropList] = useState<Array<AirdropInfo>>([]);

  const getAirdropList = async () => {
    const currentTime = Date.now();
    const airdrops = await airdropClient.airdrops(AIRDROPS);
    const filteredAirdrops = airdrops.filter(
      (item) =>
        item.isOpen === true &&
        currentTime >= Number(item.startTime) &&
        currentTime <= Number(item.endTime),
    );
    setAirdropList(filteredAirdrops);
  };
  useEffect(() => {
    getAirdropList();
  }, []);
  return (
    <div className="flex flex-col gap-6">
      {airdropList &&
        airdropList.map((item) => {
          return <AirdropItem key={item.round} data={item} locale={locale} />;
        })}
    </div>
  );
};

export default AirdropList;
