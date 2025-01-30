import { Prisma } from '@prisma/client';
import { upsert } from '@/user/dao/transferRecord.dao';

export const handleTransfer = async (
  event: Prisma.TransferRecordCreateInput,
) => {
  await upsert(event);
};
