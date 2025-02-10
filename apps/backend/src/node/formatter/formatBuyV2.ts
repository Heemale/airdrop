import { BuyV2Summary } from '@local/airdrop-sdk/node';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatBuyV2 = (
  eventObject: BuyV2Summary,
): Prisma.BuyRecordUncheckedCreateInput => {
  const { sender, rank, eventId, nodeNum, timestampMs, paymentAmount } =
    eventObject;
  return {
    txDigest: eventId.txDigest,
    eventSeq: eventId.eventSeq,
    sender: sender.toLowerCase(),
    rank: BigInt(rank), // 确保 rank 是数字
    nodeNum: BigInt(nodeNum),
    paymentAmount: BigInt(paymentAmount),

    timestamp: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
  };
};
