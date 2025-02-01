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
    timestamp: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
    sender: sender.toLowerCase(),
    rank: BigInt(rank),
    nodeNum: BigInt(nodeNum),
    paymentAmount: BigInt(paymentAmount),
    inviterGains: BigInt(inviterGains),
    nodeReceiverGains: BigInt(nodeReceiverGains),
  };
};
