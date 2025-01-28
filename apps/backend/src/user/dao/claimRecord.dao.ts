import { prisma } from '@/config/prisma';

export const getAndUpdateAirdropAmountWithCursor = async (
  sender: string,
  cursor: number | null, // 游标，null 表示第一页
  pageSize: number,
) => {
  try {
    let claimRecords;
    console.log('Cursor===============:', cursor);

    // 如果 cursor 存在，进行分页查询
    if (cursor) {
      claimRecords = await prisma.claimRecord.findMany({
        where: {
            sender: sender,
        },
        select:{
            round:true,
            coinType:true,
            amount:true,
            timestamp:true,
        },
        take: pageSize, // 每页的记录数
        skip: 1, // 跳过游标对应的记录
        cursor: { id: cursor }, // 使用游标
        orderBy: {
          createAt: 'desc', // 根据创建时间排序
        },
      });
      
    } else {
      // 如果 cursor 不存在，查询第一页数据
      claimRecords = await prisma.claimRecord.findMany({
        where: {
            sender: sender,
        },
        select:{
            round:true,
            coinType:true,
            amount:true,
            timestamp:true,
        },
        take: pageSize, // 每页的记录数
        orderBy: {
          createAt: 'desc', // 根据创建时间排序
        },
      });
    }
    console.log('Query Result======================:', claimRecords);


    // 获取下一页游标
    const nextCursor =
      claimRecords.length === pageSize
        ? claimRecords[claimRecords.length - 1].id // 如果记录达到分页大小，返回最后一条记录的 id
        : null; // 否则返回 null，表示没有更多数据

    return {
      success: true,
      message: 'Total airdrop amount calculated successfully',
      claimRecords, // 当前页数据
      nextCursor, // 下一页的游标
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error calculating total airdrop amount',
      error: error.message,
    };
  }
};

// 用于更新空投记录
export const updateClaimRecord = async (
  address: string,
  amount: bigint,
  txDigest: string,
  eventSeq: string,
) => {
  // 更新用户的空投领取记录
  return prisma.claimRecord.upsert({
    where: {
      txDigest_eventSeq: {
        // 使用 txDigest 和 eventSeq 组合作为唯一标识
        txDigest, // 事务的txDigest
        eventSeq, // 事件序列号
      },
    },
    update: {
      amount, // 更新金额
      updateAt: Date.now(),
    },
    create: {
      sender: address, // 创建新的记录
      amount,
      txDigest,
      eventSeq,
      createAt: Date.now(),
      updateAt: Date.now(),
    },
  });
};
