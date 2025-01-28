import { ClaimSummary } from '@local/airdrop-sdk/airdrop';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatClaim = (
  eventObject: ClaimSummary,
): Prisma.ClaimRecordCreateInput => {
  const { sender, round, eventId, coinType, amount, timestampMs } = eventObject;
  return {
    txDigest: eventId.txDigest,
    eventSeq: eventId.eventSeq,
    sender: sender.toLowerCase(),
    round: Number(round),
    coinType: coinType.toLowerCase(),
    amount: Number(amount),
    timestamp: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
  };
};
