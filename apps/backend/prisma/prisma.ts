import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query'], // 启用查询日志，显示 SQL 查询
});

export { prisma };
