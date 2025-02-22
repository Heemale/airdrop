import { Prisma } from '@prisma/client';
import { upsertGlobal } from '@/global/dao/global.dao';

export const handlerUpdateInitializationList = async (
	event: Prisma.ObjectCreateInput,
) => {
	await upsertGlobal(event);
};
