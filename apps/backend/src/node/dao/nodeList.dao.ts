import { prisma } from '@/config/prisma';

export const findAllNodes = async () => {
  try {
    // 查询所有节点
    const nodes = await prisma.node.findMany({
      orderBy: {
        rank: 'asc', // 按照 rank 排序
      },
      select: {
        id: true,
        rank: true,
        name: true,
        description: true,
        isOpen: true,
        isRemove: true,
        price: true,
        totalQuantity: true,
        purchasedQuantity: true,
      },
    });

    // 如果没有数据，直接返回空数组
    if (nodes.length === 0) {
      return [];
    }

    // 格式化返回数据（将 BigInt 转为字符串）
    const formattedNodes = nodes.map((node) => {
      return {
        id: node.id,
        rank: node.rank.toString(),
        name: node.name,
        description: node.description,
        isOpen: node.isOpen,
        isRemove: node.isRemove,

        price: node.price ? node.price.toString() : null,
        totalQuantity: node.totalQuantity
          ? node.totalQuantity.toString()
          : null,
        purchasedQuantity: node.purchasedQuantity
          ? node.purchasedQuantity.toString()
          : null,
      };
    });
console.log(123,formattedNodes)
    return formattedNodes;
  } catch (error) {
    console.error('Error retrieving nodes:', error);
    throw new Error('Failed to fetch nodes');
  }
};
