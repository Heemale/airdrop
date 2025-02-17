import { Prisma } from '@prisma/client';
import { upsertNode } from '@/node/dao/node.dao';

export const handleChange = async (event: Prisma.NodeUncheckedCreateInput) => {
  await upsertNode(event);
};
