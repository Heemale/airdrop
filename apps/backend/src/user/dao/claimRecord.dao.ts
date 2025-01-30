import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';

export const findClaimRecords = async (
  sender: string,
  cursor: number | null, // 游标，null 表示第一页
  pageSize: number,
) => {
  const records = await prisma.claimRecord.findMany({
    where: {
      sender: sender,
    },
    select: {
      id: true,
      round: true,
      coinType: true,
      amount: true,
      timestamp: true,
    },
    take: pageSize, // 每页的记录数
    skip: cursor ? 1 : 0, // 跳过游标对应的记录
    cursor: cursor && { id: Number(cursor) }, // 使用游标
    orderBy: {
      createAt: 'desc', // 根据创建时间排序
    },
  });

  // 获取下一页游标
  // 如果记录达到分页大小，返回最后一条记录的 id
  // 否则返回 null，表示没有更多数据
  const nextCursor =
    records.length === pageSize ? records[records.length - 1].id : null;

  return {
    data: records,
    nextCursor,
  };
};

export const upsert = async (data: Prisma.ClaimRecordCreateInput) => {
  return prisma.claimRecord.upsert({
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
