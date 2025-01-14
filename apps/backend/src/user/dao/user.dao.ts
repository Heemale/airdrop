import { prisma } from '@/config/prisma';

export const findUserByAddress = async (address: string) => {
  return prisma.user.findUnique({
    where: {
      address,
    },
  });
};

export const directSubordinates = async (ids: string | undefined) => {
  if (!ids) {
    return prisma.user.findMany({
      where: {
        isRoot: true,
      },
      select: {
        id: true,
        address: true,
        sharerIds: true,
      },
    });
  } else {
    return prisma.user.findMany({
      where: {
        id: {
          in: ids.split(',').map((id) => parseInt(id)),
        },
      },
      select: {
        id: true,
        address: true,
        sharerIds: true,
      },
    });
  }
};

export const upsertUser = async (data: any) => {
  return prisma.user.upsert({
    where: {
      address: data.address,
    },
    update: {
      ...data,
    },
    create: {
      ...data,
    },
  });
};

// 统计所有下级
export const getAllSubordinates = async (userId: number) => {
  // 获取当前用户的直接下级
  const directChildren = await prisma.user.findUnique({
    where: { id: userId },
    select: { sharerIds: true },
  });

  if (!directChildren?.sharerIds) {
    return {
      allSubordinates: [],
      directSubordinates: [],
    };
  }

  // 分解直接下级的 ID 列表
  const directChildIds = directChildren.sharerIds.split(',').map(Number);

  // 存储所有下级 ID
  let allSubordinates: number[] = directChildIds;

  // 递归查找每个下级的下级
  for (let childId of directChildIds) {
    const childSubordinates = await getAllSubordinates(Number(childId));
    allSubordinates = [
      ...allSubordinates,
      ...childSubordinates.allSubordinates,
    ];
  }

  return {
    allSubordinates,
    directSubordinates: directChildIds,
  };
};
