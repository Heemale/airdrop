import { TransferSummary } from '@local/airdrop-sdk/node';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatTransfer = (
  eventObject: TransferSummary,
): Prisma.TransferRecordCreateInput => {
  const { sender, receiver, rank, eventId, nodeNum, timestampMs } = eventObject;
  return {
    txDigest: eventId.txDigest,
    eventSeq: eventId.eventSeq,
    sender: sender.toLowerCase(),
    receiver: receiver.toLowerCase(),
    rank: Number(rank),
    nodeNum: Number(nodeNum),
    timestamp: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
  };
};
