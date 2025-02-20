import { Prisma } from '@prisma/client';
import { upsert } from '@/airdrop/dao/airdrop.dao';


export const handlerModifyLimit = async (
  event: Prisma.SpecialLimitCreateInput,
) => {
  await upsert(event);

};
