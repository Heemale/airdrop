import { SpecialUserLimitSummary } from '@local/airdrop-sdk/limit';
import { Prisma } from '@prisma/client';

export const formatModifyLimit = (
  eventObject: SpecialUserLimitSummary,
): Prisma.SpecialLimitCreateInput => {
  const { times, isLimit } = eventObject;
  return {
    times,
    isLimit,
  };
};
