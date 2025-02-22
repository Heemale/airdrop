import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';

export const create = async (data: Prisma.AdminCreateInput) => {
  return prisma.admin.create({
    data: { ...data },
  });
};

export const getAdmin = async (username: string) => {
  return prisma.admin.findUnique({
    where: {
      username,
    },
  });
};
