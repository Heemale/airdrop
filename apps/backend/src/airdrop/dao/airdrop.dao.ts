import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';
import { consoleError } from '@/log';

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
export const findAllAirdrops = async () => {
  try {
    // 查询所有空投
    const airdrops = await prisma.airdrop.findMany({
      orderBy: {
        round: 'asc', // 按照 round 排序
      },
      select: {
        round: true,
        startTime: true,
        endTime: true,
        totalShares: true,
        claimedShares: true,
        totalBalance: true,
        isOpen: true,
        description: true,
        imageUrl: true,
        coinType: true,
        remainingBalance: true,
      },
    });

    // 如果没有数据，直接返回空数组
    if (airdrops.length === 0) {
      return [];
    }

    // 格式化返回数据（将 BigInt 转为字符串）
    const formattedAirdrops = airdrops.map((airdrop) => {
      return {
        round: airdrop.round.toString(),
        startTime: airdrop.startTime.toString(),
        endTime: airdrop.endTime.toString(),
        totalShares: airdrop.totalShares.toString(),
        claimedShares: airdrop.claimedShares.toString(),
        totalBalance: airdrop.totalBalance.toString(),
        isOpen: airdrop.isOpen,
        description: airdrop.description,
        image_url: airdrop.imageUrl,
        coinType: airdrop.coinType,
        remaining_balance: airdrop.remainingBalance
          ? airdrop.remainingBalance.toString()
          : null,
      };
    });
    return formattedAirdrops;
  } catch (error) {
    consoleError('Error retrieving airdrops:', error);
    throw new Error('Failed to fetch airdrops');
  }
};
