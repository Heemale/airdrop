import { AirdropChangeSummary } from '@local/airdrop-sdk/airdrop';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatAirdropChange = (
  eventObject: AirdropChangeSummary,
): Prisma.AirdropCreateInput => {
  const {
    round,
    startTime,
    endTime,
    description,
    totalShares,
    claimedShares,
    totalBalance,
    coinType,
    imageUrl,
    isOpen,
    isRemove,
    remainingBalance,
  } = eventObject;
  return {
    round,
    coinType,
    totalShares,
    description,
    isOpen,
    isRemove,
    imageUrl,
    claimedShares,
    totalBalance,
    remainingBalance,
    startTime: BigInt(toFixed(convertSmallToLarge(startTime.toString(), 3), 0)),
    endTime: BigInt(toFixed(convertSmallToLarge(endTime.toString(), 3), 0)),
  };
};
