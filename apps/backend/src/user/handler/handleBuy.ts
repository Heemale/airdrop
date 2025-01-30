import { Prisma } from '@prisma/client';
import { upsert } from '@/user/dao/buyRecord.dao';

export const handleBuy = async (event: Prisma.BuyRecordCreateInput) => {
  await upsert(event);
};
