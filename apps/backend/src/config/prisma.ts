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
  },
});
