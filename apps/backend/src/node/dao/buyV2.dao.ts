import { prisma } from '@/config/prisma';

export const findBuyRecordsBySender = async (
	sender: string,
	cursor: number | null | undefined,
	pageSize: number,
) => {
	const records = await prisma.buyRecord.findMany({
		where: { sender },
		select: {
			id: true,
			sender: true,
			rank: true,
			timestamp: true,
			nodeNum: true,
			paymentAmount: true,
		},
		take: pageSize,
		skip: cursor ? 1 : 0,
		cursor: cursor && { id: Number(cursor) },
		orderBy: { timestamp: 'desc' },
	});

	if (records.length === 0) {
		return { data: [], nextCursor: null, hasNextPage: false };
	}

	const ranks = Array.from(new Set(records.map((r) => r.rank)));

	const nodes = await prisma.node.findMany({
		where: { rank: { in: ranks } },
		select: {
			rank: true,
			name: true,
			description: true,
		},
	});

	const nodeMap = new Map(nodes.map((node) => [node.rank, node]));

	const recordsWithNodes = records.map((record) => {
		const { timestamp, rank, nodeNum, paymentAmount, ...recordRest } = record;
		const node = nodeMap.get(record.rank) || null;
		if (node) {
			const { rank, ...nodeRest } = node;
			return {
				timestamp: timestamp.toString(),
				rank: rank.toString(),
				nodeNum: nodeNum.toString(),
				paymentAmount: paymentAmount.toString(),
				...recordRest,
				node: {
					rank: rank.toString(),
					...nodeRest,
				},
			};
		} else {
			return {
				timestamp: timestamp.toString(),
				rank: rank.toString(),
				nodeNum: nodeNum.toString(),
				paymentAmount: paymentAmount.toString(),
				...recordRest,
				node: null,
			};
		}
	});

	const hasNextPage = records.length === pageSize;
	const nextCursor = records.length > 0 ? records[records.length - 1].id : null;

	return {
		data: recordsWithNodes,
		nextCursor,
		hasNextPage,
	};
};
