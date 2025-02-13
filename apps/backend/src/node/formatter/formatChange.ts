import { NodeChangeSummary } from '@local/airdrop-sdk/node';
import { Prisma } from '@prisma/client';

export const formatChange = (
  eventObject: NodeChangeSummary,
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
    isRemove: isRemove,
  };
};
