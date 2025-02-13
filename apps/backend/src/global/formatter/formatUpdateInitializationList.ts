import { UpdateInitializationListSummary } from '@local/airdrop-sdk/global';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatUpdateInitializationList = (
  eventObject: UpdateInitializationListSummary,
): Prisma.ObjectUncheckedUpdateInput => {
  const { object } = eventObject;
  return {
    object: object.toLowerCase(),
    isValid: true,
  };
};
