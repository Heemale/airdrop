import { Prisma } from '@prisma/client';
import { prisma } from '@/config/prisma';
import { upsert as upsertBuyRecord } from '@/buy/dao/buyRecord.dao';
import { upsert as upsertInvestChangeRecord } from '@/user/dao/investChangeRecord.dao';
import { upsert as upsertGainsChangeRecord } from '@/user/dao/gainsChangeRecord.dao';
import { PaymentDetails } from '@/buy/formatter/formatBuy';

export const handleBuy = async (
  event: Prisma.BuyRecordCreateInput & PaymentDetails,
) => {
  try {
    await prisma.$transaction(async (tx) => {
      const {
        txDigest,
        eventSeq,
        sender,
        rank,
        nodeNum,
        timestamp,
        paymentAddress,
        paymentAmount,
        inviterAddress,
        inviterGains,
        nodeReceiverAddress,
        nodeReceiverGains,
      } = event;
      await upsertBuyRecord(
        {
          txDigest,
          eventSeq,
          timestamp,
          sender,
          rank,
          nodeNum,
        },
        tx,
      );
      // 更新投资变动表
      await upsertInvestChangeRecord(
        {
          txDigest,
          eventSeq,
          timestamp,
          address: paymentAddress,
          amount: paymentAmount,
          isIncrease: true,
        },
        tx,
      );
      // 更新收益变动表
      if (inviterAddress) {
        await upsertGainsChangeRecord(
          {
            txDigest,
            eventSeq,
            timestamp,
            address: inviterAddress,
            amount: inviterGains,
            isIncrease: true,
          },
          tx,
        );
      }
      if (nodeReceiverAddress) {
        await upsertGainsChangeRecord(
          {
            txDigest,
            eventSeq,
            timestamp,
            address: nodeReceiverAddress,
            amount: nodeReceiverGains,
            isIncrease: true,
          },
          tx,
        );
      }
    });
  } catch (error) {
    console.error('Error in handleBuy:', error.message);
    throw error;
  }
};
