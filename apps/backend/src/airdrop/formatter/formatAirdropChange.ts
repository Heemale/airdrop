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
    startTime,
    endTime,
  };
};
