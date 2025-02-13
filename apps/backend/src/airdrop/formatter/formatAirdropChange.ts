import { AirdropChangeSummary } from '@local/airdrop-sdk/airdrop';
import { Prisma } from '@prisma/client';

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
    round: BigInt(round),
    coinType,
    totalShares: BigInt(totalShares),
    description: description.toLowerCase(),
    isOpen,
    isRemove,
    imageUrl: imageUrl.toLowerCase(),
    claimedShares: BigInt(claimedShares),
    totalBalance: BigInt(totalBalance),
    remainingBalance: BigInt(remainingBalance),
    startTime: BigInt(startTime),
    endTime: BigInt(endTime),
  };
};
