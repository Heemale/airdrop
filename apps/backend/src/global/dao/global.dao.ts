import {
  DynamicClientExtensionThis,
  Record,
  TypeMapCbDef,
  TypeMapDef,
} from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import { prisma } from '@/config/prisma';

export const upsertGlobal = async <
  TypeMap extends TypeMapDef,
  TypeMapCb extends TypeMapCbDef,
  ExtArgs extends Record<string, any>,
  ClientOptions,
>(
  data: Prisma.ObjectCreateInput,
  tx?: Omit<
    DynamicClientExtensionThis<TypeMap, TypeMapCb, ExtArgs, ClientOptions>,
    '$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
  >,
) => {
  const db = tx ?? prisma;
  return db.object.upsert({
    where: {
      object: data.object,
    },
    update: {
      ...data,
    },
    create: {
      ...data,
    },
  });
};
