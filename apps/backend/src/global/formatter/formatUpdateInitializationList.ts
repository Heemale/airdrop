import { UpdateInitializationListSummary } from '@local/airdrop-sdk/global';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatUpdateInitializationList = (
  eventObject: UpdateInitializationListSummary,
): Prisma.ObjectUncheckedUpdateInput => {
  const { object, is_valid } = eventObject;
  return {
    object: object.toLowerCase(),
    isValid: is_valid,
  };
};
