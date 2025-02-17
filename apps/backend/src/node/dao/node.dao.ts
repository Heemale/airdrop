import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';
import {
  DynamicClientExtensionThis,
  Record,
  TypeMapCbDef,
  TypeMapDef,
} from '@prisma/client/runtime/library';

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
        limit: true,
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
        limit: node.limit.toString(),
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
    return formattedNodes;
  } catch (error) {
    console.error('Error retrieving nodes:', error);
    throw new Error('Failed to fetch nodes');
  }
};

export const upsertNode = <
  TypeMap extends TypeMapDef,
  TypeMapCb extends TypeMapCbDef,
  ExtArgs extends Record<string, any>,
  ClientOptions,
>(
  data: Prisma.NodeCreateInput,
  tx?: Omit<
    DynamicClientExtensionThis<TypeMap, TypeMapCb, ExtArgs, ClientOptions>,
    '$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
  >,
) => {
  const db = tx ?? prisma;
  return db.node.upsert({
    where: {
      rank: data.rank,
    },
    update: {
      ...data,
      updateAt: Math.floor(Date.now() / 1000),
    },
    create: {
      ...data,
      createAt: Math.floor(Date.now() / 1000),
      updateAt: Math.floor(Date.now() / 1000),
    },
  });
};
