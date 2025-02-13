import { SpecialUserLimitSummary } from '@local/airdrop-sdk/limit';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatModifyLimit = (
  eventObject: SpecialUserLimitSummary,
): Prisma.SpecialLimitUncheckedCreateInput => {
  const { times } = eventObject;
  return {
    times: BigInt(times),
    isLimit: true,
  };
};
