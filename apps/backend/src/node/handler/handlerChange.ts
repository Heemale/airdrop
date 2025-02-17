import { Prisma } from '@prisma/client';
import { prisma } from '@/config/prisma';

export const handleChange = async (event: Prisma.NodeCreateInput) => {
  try {
    await prisma.$transaction(async (tx) => {
      const updatedNodeData = {
        ...event,
        rank: BigInt(event.rank),
      };

      await tx.node.upsert({
        where: { rank: event.rank }, // 以 rank 作为唯一键
        update: updatedNodeData,
        create: updatedNodeData,
      });
    });
  } catch (error) {
    console.error('Node change synchronization failed', error.message);
  }
};
