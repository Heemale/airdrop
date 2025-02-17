import { NodeChangeSummary } from '@local/airdrop-sdk/node';
import { Prisma } from '@prisma/client';

export const formatChange = (
  eventObject: NodeChangeSummary,
): Prisma.NodeCreateInput => {
  const {
    rank,
    description,
    name,
    limit,
    price,
    totalQuantity,
    purchasedQuantity,
    isRemove,
    isOpen,
  } = eventObject;
  return {
    name: name,
    rank: BigInt(rank), // 确保 rank 是数字
    description: description,
    isOpen: isOpen,
    limit: BigInt(limit),
    price: BigInt(price),
    totalQuantity: BigInt(totalQuantity),
    purchasedQuantity: BigInt(purchasedQuantity),
    isRemove: isRemove,
  };
};
