import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';

export const findClaimRecords = async (
	sender: string,
	cursor: number | null | undefined,
	pageSize: number,
) => {
	const data = await prisma.claimRecord.findMany({
		where: {
			sender: sender,
		},
		select: {
			id: true,
			round: true,
			coinType: true,
			amount: true,
			timestamp: true,
		},
		take: pageSize,
		skip: cursor ? 1 : 0,
		cursor: cursor && { id: Number(cursor) },
		orderBy: {
			timestamp: 'desc',
		},
	});

	const hasNextPage = data.length === pageSize;
	const nextCursor = hasNextPage ? data[data.length - 1].id : null;

	return {
		data,
		nextCursor,
		hasNextPage,
	};
};

export const upsert = async (data: Prisma.ClaimRecordCreateInput) => {
	return prisma.claimRecord.upsert({
		where: {
			txDigest_eventSeq: {
				txDigest: data.txDigest,
				eventSeq: data.eventSeq,
			},
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
