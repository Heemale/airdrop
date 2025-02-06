import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';
import {
  DynamicClientExtensionThis,
  Record,
  TypeMapCbDef,
  TypeMapDef,
} from '@prisma/client/runtime/library';

export const upsert = async <
  TypeMap extends TypeMapDef,
  TypeMapCb extends TypeMapCbDef,
  ExtArgs extends Record<string, any>,
  ClientOptions,
>(
  data: Prisma.BuyRecordCreateInput,
  tx?: Omit<
    DynamicClientExtensionThis<TypeMap, TypeMapCb, ExtArgs, ClientOptions>,
    '$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
  >,
) => {
  const db = tx ?? prisma;
  const { node, ...rest } = data;
  return db.buyRecord.upsert({
    where: {
      txDigest_eventSeq: {
        txDigest: data.txDigest,
        eventSeq: data.eventSeq,
      },
    },
    update: {
      ...rest,
      updateAt: Math.floor(Date.now() / 1000),
    },
    create: {
      ...rest,
      createAt: Math.floor(Date.now() / 1000),
      updateAt: Math.floor(Date.now() / 1000),
      ...(node
        ? {
            node: {
              connectOrCreate: {
                // where 部分使用传入的 node.connect 作为唯一查找条件
                where: {
                  ...node.connect, // 例如：{ rank: someRank }
                },
                // create 部分明确指定 Node 创建时需要的字段
                create: {
                  // 使用 node.connect 中的 rank 值
                  rank: node.connect.rank,
                  // 如果传入了 node.nodeNumName，则使用它；否则使用默认值
                  description: (node as any).description || '无',
                  // 同理，使用传入的 name，否则使用默认值
                  name: (node as any).name || '无',
                  // 如有其它必填字段，请在此处补充
                },
              },
            },
          }
        : {}),
    },
  });
};
