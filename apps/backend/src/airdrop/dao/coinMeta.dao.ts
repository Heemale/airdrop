import { prisma } from '@/config/prisma';
import {
  DynamicClientExtensionThis,
  Record,
  TypeMapCbDef,
  TypeMapDef,
} from '@prisma/client/runtime/library';
import { consoleError } from '@/log';

export const upsertCoinMeta = async <
  TypeMap extends TypeMapDef,
  TypeMapCb extends TypeMapCbDef,
  ExtArgs extends Record<string, any>,
  ClientOptions,
>(
  name: string,
  symbol: string,
  description: string,
  decimals: number,
  iconUrl: string,
  objectId: string,
  coinType: string,
  tx?: Omit<
    DynamicClientExtensionThis<TypeMap, TypeMapCb, ExtArgs, ClientOptions>,
    '$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
  >,
) => {
  const db = tx ?? prisma;
  return db.tokenMetadata.upsert({
    where: {
      objectId: objectId,
    },
    update: {
      objectId,
      name,
      symbol,
      description,
      decimals,
      iconUrl,
      id: coinType,
      updateAt: Math.floor(Date.now() / 1000),
    },
    create: {
      objectId,
      name,
      symbol,
      description,
      decimals,
      iconUrl,
      id: coinType,
      createAt: Math.floor(Date.now() / 1000),
      updateAt: Math.floor(Date.now() / 1000),
    },
  });
};
export const findTokenMetadata = async (coinTypes: string[]) => {
  try {
    const tokenMetadata = await prisma.tokenMetadata.findMany({
      where: {
        id: {
          in: coinTypes, // 使用 in 操作符
        },
      },
      select: {
        objectId: true,
        id: true,
        name: true,
        symbol: true,
        description: true,
        decimals: true,
        iconUrl: true,
        createAt: true,
        updateAt: true,
      },
    });

    if (!tokenMetadata) {
      return null;
    }

    return tokenMetadata.map((token) => ({
      objectId: token.objectId,
      name: token.name,
      symbol: token.symbol,
      description: token.description,
      decimals: token.decimals.toString(),
      coinType: token.id,
      iconUrl: token.iconUrl,
      createAt: token.createAt ? token.createAt.toString() : null,
      updateAt: token.updateAt ? token.updateAt.toString() : null,
    }));
  } catch (error) {
    consoleError('Error retrieving token metadata:', error);
    throw new Error('Failed to fetch token metadata');
  }
};
