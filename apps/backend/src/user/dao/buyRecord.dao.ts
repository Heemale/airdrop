import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';

export const upsert = async (data: Prisma.BuyRecordCreateInput) => {
  return prisma.buyRecord.upsert({
    where: {
      txDigest_eventSeq: {
        txDigest: data.txDigest,
        eventSeq: data.eventSeq,
      },
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
