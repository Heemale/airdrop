import { BindSummary } from '@local/airdrop-sdk/invite';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatBind = (
  eventObject: BindSummary,
): Prisma.UserCreateInput => {
  const { sender, inviter, eventId, timestampMs } = eventObject;
  return {
    txDigest: eventId.txDigest,
    eventSeq: eventId.eventSeq,
    address: sender.toLowerCase(),
    inviter: inviter.toLowerCase(),
    isBind: true,
    createAt: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
  };
};
