import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient().$extends({
  result: {
    claimRecord: {
      round: {
        needs: { round: true },
        compute: (record) => record.round?.toString(),
      },
      amount: {
        needs: { amount: true },
        compute: (record) => record.amount?.toString(),
      },
      timestamp: {
        needs: { timestamp: true },
        compute: (record) => record.timestamp?.toString(),
      },
    },
    buyRecord:{
      rank: {
        needs: { rank: true },
        compute: (record) => record.rank?.toString(),
      },
      timestamp: {
        needs: { timestamp: true },
        compute: (record) => record.timestamp?.toString(),
      },
      nodeNum: {
        needs: { nodeNum: true },
        compute: (record) => record.nodeNum?.toString(),
      },
      paymentAmount: {
        needs: { paymentAmount: true },
        compute: (record) => record.paymentAmount?.toString(),
      },
    }

  },

});
