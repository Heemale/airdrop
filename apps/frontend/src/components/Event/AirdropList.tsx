'use client';

import * as React from 'react';
import AirdropItem from '@/components/Event/AirdropItem';
import { useEffect, useState } from 'react';
import { getCurrentTimestampMs } from '@/utils/time';
import { nodeClient } from '@/sdk';
import { NODES } from '@/sdk/constants';
import { message } from 'antd';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { handleTxError } from '@/sdk/error';
import { useClientTranslation } from '@/hook';
import { NodeStatus } from '@local/airdrop-sdk/node';
import { getAirdropInfo } from '@/api';
import type { AirdropInfo } from '@/api/types/response';

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
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [cursor, setCursor] = useState<number | null>(null);

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

  const getAirdropList = async (cursor: number | null = null) => {
    if (!hasMore || loading) return; // 防止重复加载

    try {
      const airdropResponse = await getAirdropInfo({ nextCursor: cursor }); // 获取空投信息
      const airdrops = airdropResponse.data || [];
      setAirdropList((prev) => [...prev, ...airdrops]);
      setCursor(airdropResponse.nextCursor); // 更新游标
      setHasMore(airdropResponse.hasNextPage); // 更新是否还有更多数据
      setLoading(false);
    } catch (e: any) {
      console.log(`getAirdropList: ${e.message}`);
      messageApi.error(`${t(handleTxError(e.message))}`);
      setLoading(false);
    }
  };
  useEffect(() => {
    getNodeStatus();
  }, [account]);

  useEffect(() => {
    getAirdropList();
  }, []);
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    // 当滚动到距离底部10px以内时，认为到达底部
    const isBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isBottom && !loading && cursor) {
      getAirdropList(cursor); // 滚动到底部时加载更多数据
    }
  };

  return (
    <div
      className="flex flex-col gap-6"
      onScroll={handleScroll}
      style={{ maxHeight: '600px', overflowY: 'auto' }}
    >
      {isOngoing
        ? airdropList
            .filter(
              (item) =>
                item.airdrop.isOpen &&
                checkIsGoing(item.airdrop.startTime, item.airdrop.endTime),
            )
            .map((item) => (
              <AirdropItem
                key={item.airdrop.round.toString()}
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
            .filter((item) => item.airdrop.isOpen)
            .map((item) => {
              const isOngoing = checkIsGoing(
                item.airdrop.startTime,
                item.airdrop.endTime,
              );
              return (
                <AirdropItem
                  key={item.airdrop.round.toString()}
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
