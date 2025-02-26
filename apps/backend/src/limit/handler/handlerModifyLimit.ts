import { Prisma } from '@prisma/client';
import { upsert } from '@/limit/dao/limit.dao';

export const handlerModifyLimit = async (
  event: Prisma.SpecialLimitCreateInput,
) => {
  await upsert(event);
};
