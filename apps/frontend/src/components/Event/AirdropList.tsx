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

interface Props {
  isOngoing?: boolean;
  ongoingText: string;
  chainText: string;
  totalCopies: string;
  rewardQuantityPerCopy: string;
  unpurchasedNode: string;
  claimText: string;
}
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
  const { t } = useClientTranslation();

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
        messageApi.error(`${t(handleTxError(e.message))}`);
      }
    }
  };

  const getAirdropList = async () => {
    try {
      const airdropData = await airdropClient.airdrops(AIRDROPS);
      console.log(1111111, airdropData);
      setAirdropList(airdropData);
    } catch (e: any) {
      console.log(`getAirdropList error: ${e.messag}`);
      messageApi.error(`${t(handleTxError(e.message))}`);
    }
  };

  const checkIsGoing = (startTime: bigint, endTime: bigint): boolean => {
    const timestampMs = getCurrentTimestampMs();
    return timestampMs >= startTime && timestampMs <= endTime;
  };

  useEffect(() => {
    getIsAlreadyBuyNode();
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
                unpurchasedNode={unpurchasedNode}
                isAlreadyBuyNode={isAlreadyBuyNode}
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
                  unpurchasedNode={unpurchasedNode}
                  isAlreadyBuyNode={isAlreadyBuyNode}
                  claimText={claimText}
                />
              );
            })}
      {contextHolder}
    </div>
  );
};

export default AirdropList;
