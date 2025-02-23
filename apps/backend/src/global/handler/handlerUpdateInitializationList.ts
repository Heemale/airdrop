import { Prisma } from '@prisma/client';
import { upsertGlobal } from '@/global/dao/object.dao';

export const handlerUpdateInitializationList = async (
  event: Prisma.ObjectCreateInput,
) => {
  await upsertGlobal(event);
};
