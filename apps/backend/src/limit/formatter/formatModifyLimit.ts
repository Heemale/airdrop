import { SpecialUserLimitSummary } from '@local/airdrop-sdk/limit';
import { Prisma } from '@prisma/client';

export const formatModifyLimit = (
  eventObject: SpecialUserLimitSummary,
): Prisma.SpecialLimitUncheckedCreateInput => {
  const { times, isLimit } = eventObject;
  return {
    times: BigInt(times),
    isLimit,
  };
};
