import { ChangeSummary } from '@local/airdrop-sdk/airdrop';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatChange = (
  eventObject: ChangeSummary,
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
    isRemove,
    remainingBalance,
  } = eventObject;
  return {
    round: BigInt(round),
    coinType,
    totalShares: BigInt(totalShares),
    description: description.toLowerCase(),
    isOpen: true,
    isRemove: true,
    imageUrl: imageUrl.toLowerCase(),
    claimedShares: BigInt(claimedShares),
    totalBalance: BigInt(totalBalance),
    remainingBalance: BigInt(remainingBalance),
    startTime: BigInt(startTime),
    endTime: BigInt(endTime),
  };
};
