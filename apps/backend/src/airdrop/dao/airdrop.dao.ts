import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';

export const upsert = (data: Prisma.AirdropCreateInput) => {
  return prisma.airdrop.upsert({
    where: {
      round: data.round,
    },
    update: {
      ...data,
      updateAt: Math.floor(Date.now() / 1000),
    },
    create: {
      ...data,
      createAt: Math.floor(Date.now() / 1000),
      updateAt: Math.floor(Date.now() / 1000),
    },
  });
};
