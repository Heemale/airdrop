import { prisma } from '@/config/prisma';

export const getAllNodes = async () => {
  try {
    // 查询所有节点
    const nodes = await prisma.node.findMany({
      where: {},
      orderBy: {
        rank: 'asc', // 按照 rank 排序，可以根据需求修改排序方式
      },
    });
    console.log(111111,nodes)
    return nodes;
  } catch (error) {
    console.error('Error retrieving nodes:', error);
    throw new Error('Failed to fetch nodes');
  }
};
