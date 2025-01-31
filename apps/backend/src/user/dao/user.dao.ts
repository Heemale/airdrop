import { prisma } from '@/config/prisma';

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

export const findUserByAddress = async (address: string) => {
  return prisma.user.findUnique({
    where: {
      address,
    },
  });
};

export const getAllSubordinates = async (userId: number) => {
  // 获取直接下级的地址和 sharerIds
  const directChildren = await prisma.user.findUnique({
    where: { id: userId },
    select: { address: true, sharerIds: true },
  });

  if (!directChildren?.sharerIds) {
    return {
      id: userId,
      address: directChildren?.address ?? null,
      allSubordinates: [],
      totalInvestmentSum: 0n,
      directSubordinates: [],
    };
  }

  // 解析 sharerIds 并转换为数组
  const directChildIds = directChildren.sharerIds
    .split(',')
    .map(Number)
    .filter(Boolean); // 过滤无效的数值

  // 批量查询下级的 totalInvestment
  const directChildUsers = await prisma.user.findMany({
    where: { id: { in: directChildIds } },
    select: { id: true, totalInvestment: true },
  });

  // 计算直接下级的投资总和
  const totalInvestmentSumFromDirect = directChildUsers.reduce(
    (sum, user) => sum + (user.totalInvestment ?? 0n),
    0n,
  );

  // 递归查询所有子用户的信息（并行执行）
  const subordinatesData = await Promise.all(
    directChildUsers.map((child) => getAllSubordinates(child.id)),
  );

  // 汇总所有下级 ID 和总投资金额
  const allSubordinates = subordinatesData.flatMap(
    (data) => data.allSubordinates,
  );
  const totalInvestmentSum = subordinatesData.reduce(
    (sum, data) => sum + data.totalInvestmentSum,
    totalInvestmentSumFromDirect,
  );

  return {
    id: userId,
    address: directChildren?.address ?? null,
    allSubordinates: [...directChildIds, ...allSubordinates], // 包含直接和间接下级
    totalInvestmentSum,
    directSubordinates: directChildIds, // 直接下级
  };
};
