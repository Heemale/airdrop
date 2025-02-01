import { Prisma } from '@prisma/client';
import { upsert } from '@/user/dao/buyRecord.dao';

export const handleBuyV2 = async (
  event: Prisma.BuyRecordUncheckedCreateInput,
) => {
  await upsert(event);
};
