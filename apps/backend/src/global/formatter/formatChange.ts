import { ChangeSummary } from '@local/airdrop-sdk/node';
import { Prisma } from '@prisma/client';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export const formatChange = (
  eventObject: ChangeSummary,
): Prisma.NodeUncheckedCreateInput => {
  const {
    rank,
    description,
    name,
    limit,
    price,
    totalQuantity,
    purchasedQuantity,
    isRemove,
  } = eventObject;
  return {
    name: name.toLowerCase(),
    rank: BigInt(rank), // 确保 rank 是数字
    description: description.toLowerCase(),
    isOpen: true,
    limit: BigInt(limit),
    price: BigInt(price),
    totalQuantity: BigInt(totalQuantity),
    purchasedQuantity: BigInt(purchasedQuantity),
    isRemove: true,
  };
};
