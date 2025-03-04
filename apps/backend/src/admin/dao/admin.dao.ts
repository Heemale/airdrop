import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';

export const createAdmin = async (data: Prisma.AdminCreateInput) => {
  return prisma.admin.create({
    data: {
      ...data,
      createAt: Math.floor(Date.now() / 1000),
    },
  });
};

export const upsertAdmin = async (data: Prisma.AdminCreateInput) => {
  return prisma.admin.upsert({
    where: {
      username: data.username,
    },
    update: {
      ...data,
      updateAt: Math.floor(Date.now() / 1000),
    },
    create: {
      ...data,
      createAt: Math.floor(Date.now() / 1000),
    },
  });
};

export const getAdmin = async (username: string) => {
  return prisma.admin.findUnique({
    where: {
      username,
    },
  });
};
