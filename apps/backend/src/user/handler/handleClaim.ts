import { Prisma } from '@prisma/client';
import { prisma } from '@/config/prisma';

export const handleClaim = async (event: Prisma.ClaimRecordCreateInput) => {
  try {
    console.log('Coin Type:', event.coinType);
    await prisma.$transaction(async (tx) => {
      // 1. 将购买事件数据保存到购买记录表 (BuyRecord)
      const claimRecord = await tx.claimRecord.create({
        data: {
          sender: event.sender,
          round: event.round,
          coinType: event.coinType,
          amount: event.amount,
        },
      });

      console.log('Claim record created:', claimRecord);
    });
  } catch (error) {
    console.error('Error in handleClaim:', error.message);
    throw error;
  }
};
