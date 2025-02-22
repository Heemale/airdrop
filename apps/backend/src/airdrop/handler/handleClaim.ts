import { Prisma } from '@prisma/client';
import { upsert } from '@/airdrop/dao/claimRecord.dao';

export const handleClaim = async (event: Prisma.ClaimRecordCreateInput) => {
	await upsert(event);
};
