import { prisma } from '@/config/prisma';

export const getAndUpdateAirdropAmount = async (address: string) => {
  try {
    // 查询该地址的所有领取空投记录
    const claimRecords = await prisma.claimRecord.findMany({
      where: {
        sender: address,  // 按照用户地址筛选
      },
      select: {
        amount: true,  // 只需要金额字段
        id: true,  // 记录 ID，以便后续操作
      },
    });

    // 计算总收益
    const totalAirdropAmount = claimRecords.reduce((total, record) => {
      return total + BigInt(record.amount || 0);  // 将金额转换为 BigInt
    }, 0n);  // 使用 BigInt 累加，避免数值溢出

    return {
      success: true,
      message: 'Total airdrop amount calculated successfully',
      totalAirdropAmount,  // 返回总收益
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
export const updateClaimRecord = async (address: string, amount: bigint, txDigest: string, eventSeq: string) => {

    // 更新用户的空投领取记录
    return prisma.claimRecord.upsert({
      where: {
        txDigest_eventSeq: { // 使用 txDigest 和 eventSeq 组合作为唯一标识
            txDigest,        // 事务的txDigest
            eventSeq,        // 事件序列号
          },
      },
      update: {
        amount,  // 更新金额
        updateAt: Date.now(),
      },
      create: {
        sender: address,  // 创建新的记录
        amount,
        txDigest,
        eventSeq,
        createAt: Date.now(),
        updateAt: Date.now(),
      },
    });

};
