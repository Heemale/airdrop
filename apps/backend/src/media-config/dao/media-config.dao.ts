import { prisma } from '@/config/prisma';

export const getMediasByPage = (page: string) => {
  return prisma.mediaConfig.findMany({
    where: {
      page,
    },
  });
};
