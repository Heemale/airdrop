import { Prisma } from '@prisma/client';
import { upsert } from '@/airdrop/dao/airdrop.dao';

export const handleAirdropChange = async (event: Prisma.AirdropCreateInput) => {
	await upsert(event);
};
