import { NodeChangeSummary } from '@local/airdrop-sdk/node';
import { Prisma } from '@prisma/client';

export const formatChange = (
	eventObject: NodeChangeSummary,
): Prisma.NodeCreateInput => {
	const {
		rank,
		name,
		description,
		limit,
		price,
		totalQuantity,
		purchasedQuantity,
		isOpen,
		isRemove,
	} = eventObject;
	return {
		rank,
		name,
		description,
		limit,
		price,
		totalQuantity,
		purchasedQuantity,
		isOpen,
		isRemove,
	};
};
