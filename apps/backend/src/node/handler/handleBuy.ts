import { Prisma } from '@prisma/client';
import { prisma } from '@/config/prisma';
import { upsert as upsertBuyRecord } from '@/node/dao/buyRecord.dao';
import { upsert as upsertInvestChangeRecord } from '@/user/dao/investChangeRecord.dao';
import { upsert as upsertGainsChangeRecord } from '@/user/dao/gainsChangeRecord.dao';
import { PaymentDetails } from '@/node/formatter/formatBuy';
import { consoleError } from '@/log';
import {
  findUserByAddress,
  increaseTotalGains,
  increaseTotalInvestment,
} from '@/user/dao/user.dao';

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

      // 更新购买记录
      await upsertBuyRecord(
        {
          txDigest,
          eventSeq,
          timestamp,
          sender,
          rank,
          nodeNum,
          paymentAmount,
          inviterGains,
          nodeReceiverGains,
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
      await upsertGainsChangeRecord(
        {
          txDigest,
          eventSeq,
          timestamp,
          address: inviterAddress,
          amount: inviterGains,
          isIncrease: true,
          nodeReceiverAddress,
          nodeReceiverGains,
        },
        tx,
      );

      // 更新用户投资金额
      const user = await findUserByAddress(sender, tx);
      if (user.totalInvestmentUpdateAt < BigInt(timestamp)) {
        await increaseTotalInvestment(user.id, paymentAmount, timestamp, tx);
      }

      // 更新邀请人收益金额
      const invite = await findUserByAddress(inviterAddress, tx);
      if (invite.totalGainsUpdateAt < BigInt(timestamp)) {
        await increaseTotalGains(invite.id, inviterGains, timestamp, tx);
      }
    });
  } catch (error) {
    consoleError('Error in handleBuy:', error.message);
    throw error;
  }
};
