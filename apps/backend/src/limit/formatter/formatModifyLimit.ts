import { ModifyLimitSummary } from '@local/airdrop-sdk/limit';
import { Prisma } from '@prisma/client';

export const formatModifyLimit = (
  eventObject: ModifyLimitSummary,
): Prisma.SpecialLimitCreateInput => {
  const { address,times, isLimit } = eventObject;
  return {
    address:address.toLowerCase(),
    times,
    isLimit,
  };
};
