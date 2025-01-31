import { BuySummary } from '@local/airdrop-sdk/node';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatBuy = (
  eventObject: BuySummary,
): Prisma.BuyRecordCreateInput => {
  const { sender, rank, eventId, nodeNum, timestampMs } = eventObject;
  return {
    txDigest: eventId.txDigest,
    eventSeq: eventId.eventSeq,
    sender: sender.toLowerCase(),
    rank: Number(rank), // 确保 rank 是数字
    nodeNum: Number(nodeNum), // 确保 nodeNum 是数字

    timestamp: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
  };
};
