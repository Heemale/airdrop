import { Prisma } from '@prisma/client';
import { prisma } from '@/config/prisma';

export const handleBuyV2 = async (
  event: Prisma.BuyRecordUncheckedCreateInput,
) => {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. 将购买事件数据保存到购买记录表 (BuyRecord)
      const buyRecord = await tx.buyRecord.create({
        data: {
          sender: event.sender,
          rank: event.rank,
          nodeNum: event.nodeNum,
          paymentAmount: event.paymentAmount,
          inviterGains: event.inviterGains,
          nodeReceiverGains: event.nodeReceiverGains,
        },
      });

      console.log('Buy record created:', buyRecord);
    });
  } catch (error) {
    console.error('Error in handleBuy:', error.message);
    throw error;
  }
};
