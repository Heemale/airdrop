import { BuyV2Summary } from '@local/airdrop-sdk/node';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatBuyV2 = (
  eventObject: BuyV2Summary,
): Prisma.BuyRecordUncheckedCreateInput => {
  const {
    sender,
    rank,
    eventId,
    nodeNum,
    timestampMs,
    paymentAmount,
    inviterGains,
    nodeReceiverGains,
  } = eventObject;
  return {
    txDigest: eventId.txDigest,
    eventSeq: eventId.eventSeq,
    sender: sender.toLowerCase(),
    rank: Number(rank), // 确保 rank 是数字
    nodeNum: Number(nodeNum), // 确保 nodeNum 是数字
    paymentAmount: Number(paymentAmount),
    inviterGains: Number(inviterGains),
    nodeReceiverGains: Number(nodeReceiverGains),
    createAt: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
  };
};
