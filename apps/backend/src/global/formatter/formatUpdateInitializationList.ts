import { UpdateInitializationListSummary } from '@local/airdrop-sdk/global';
import { Prisma } from '@prisma/client';

export const formatUpdateInitializationList = (
  eventObject: UpdateInitializationListSummary,
): Prisma.ObjectCreateInput => {
  const { object, isValid } = eventObject;
  return {
    object,
    isValid,
  };
};
