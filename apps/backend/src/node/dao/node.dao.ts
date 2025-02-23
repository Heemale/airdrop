import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';
import {
  DynamicClientExtensionThis,
  Record,
  TypeMapCbDef,
  TypeMapDef,
} from '@prisma/client/runtime/library';
import { consoleError } from '@/log';

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
    consoleError('Error retrieving nodes:', error);
    throw new Error('Failed to fetch nodes');
  }
};

export const getBuyRecordsBySender = async (
  sender: string,
  cursor: number | null | undefined,
  pageSize: number,
) => {
  const records = await prisma.buyRecord.findMany({
    where: { sender },
    select: {
      id: true,
      sender: true,
      rank: true,
      timestamp: true,
      nodeNum: true,
      paymentAmount: true,
    },
    take: pageSize,
    skip: cursor ? 1 : 0,
    cursor: cursor && { id: Number(cursor) },
    orderBy: { timestamp: 'desc' },
  });

  if (records.length === 0) {
    return { data: [], nextCursor: null, hasNextPage: false };
  }

  const ranks = Array.from(new Set(records.map((r) => r.rank)));

  const nodes = await prisma.node.findMany({
    where: { rank: { in: ranks } },
    select: {
      rank: true,
      name: true,
      description: true,
    },
  });

  const nodeMap = new Map(nodes.map((node) => [node.rank, node]));

  const recordsWithNodes = records.map((record) => {
    const { timestamp, rank, nodeNum, paymentAmount, ...recordRest } = record;
    const node = nodeMap.get(record.rank) || null;
    if (node) {
      const { rank, ...nodeRest } = node;
      return {
        timestamp: timestamp.toString(),
        rank: rank.toString(),
        nodeNum: nodeNum.toString(),
        paymentAmount: paymentAmount.toString(),
        ...recordRest,
        node: {
          rank: rank.toString(),
          ...nodeRest,
        },
      };
    } else {
      return {
        timestamp: timestamp.toString(),
        rank: rank.toString(),
        nodeNum: nodeNum.toString(),
        paymentAmount: paymentAmount.toString(),
        ...recordRest,
        node: null,
      };
    }
  });

  const hasNextPage = records.length === pageSize;
  const nextCursor = records.length > 0 ? records[records.length - 1].id : null;

  return {
    data: recordsWithNodes,
    nextCursor,
    hasNextPage,
  };
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
