import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';

// 查询某个地址的购买记录，支持分页
export const findBuyRecordsBySender = async (
  sender: string,
  cursor: number | null | undefined,
  pageSize: number,
) => {
  const records = await prisma.buyRecord.findMany({
    where: {
      sender: sender, // 筛选指定地址
    },
    select: {
      id: true,
      sender: true,
      rank: true,
      timestamp: true,
      nodeNum: true,
      paymentAmount: true,
    },
    take: pageSize,
    skip: cursor ? 1 : 0,
    cursor: cursor && { id: Number(cursor) },
    orderBy: {
      timestamp: 'desc',
    },
  });
  const hasNextPage = records.length === pageSize;
  const nextCursor = records.length > 0 ? records[records.length - 1].id : null;

  return {
    data: records,
    nextCursor,
    hasNextPage,
  };
};
