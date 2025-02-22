import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';
import {
	DynamicClientExtensionThis,
	Record,
	TypeMapCbDef,
	TypeMapDef,
} from '@prisma/client/runtime/library';
export const upsertUser = async <
	TypeMap extends TypeMapDef,
	TypeMapCb extends TypeMapCbDef,
	ExtArgs extends Record<string, any>,
	ClientOptions,
>(
	data: Prisma.UserCreateInput,
	tx?: Omit<
		DynamicClientExtensionThis<TypeMap, TypeMapCb, ExtArgs, ClientOptions>,
		'$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
	>,
) => {
	const db = tx ?? prisma;
	return db.user.upsert({
		where: {
			address: data.address,
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

export const increaseTotalInvestment = async <
	TypeMap extends TypeMapDef,
	TypeMapCb extends TypeMapCbDef,
	ExtArgs extends Record<string, any>,
	ClientOptions,
>(
	userId: number,
	amount: bigint,
	timestamp: bigint | number,
	tx?: Omit<
		DynamicClientExtensionThis<TypeMap, TypeMapCb, ExtArgs, ClientOptions>,
		'$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
	>,
) => {
	const db = tx ?? prisma;
	return db.user.update({
		where: { id: userId },
		data: {
			totalInvestment: {
				increment: amount,
			},
			totalInvestmentUpdateAt: timestamp,
		},
	});
};

export const increaseTotalGains = async <
	TypeMap extends TypeMapDef,
	TypeMapCb extends TypeMapCbDef,
	ExtArgs extends Record<string, any>,
	ClientOptions,
>(
	userId: number,
	amount: bigint,
	timestamp: bigint | number,
	tx?: Omit<
		DynamicClientExtensionThis<TypeMap, TypeMapCb, ExtArgs, ClientOptions>,
		'$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
	>,
) => {
	const db = tx ?? prisma;
	return db.user.update({
		where: { id: userId },
		data: {
			totalGains: {
				increment: amount,
			},
			totalGainsUpdateAt: timestamp,
		},
	});
};

export const findUserByAddress = async <
	TypeMap extends TypeMapDef,
	TypeMapCb extends TypeMapCbDef,
	ExtArgs extends Record<string, any>,
	ClientOptions,
>(
	address: string,
	tx?: Omit<
		DynamicClientExtensionThis<TypeMap, TypeMapCb, ExtArgs, ClientOptions>,
		'$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
	>,
) => {
	const db = tx ?? prisma;
	return db.user.findUnique({
		where: {
			address,
		},
	});
};

export const getAllSubordinates = async (userId: number) => {
	// 获取直接下级的地址和 sharerIds
	const directChildren = await prisma.user.findUnique({
		where: { id: userId },
		select: { address: true, sharerIds: true },
	});

	if (!directChildren?.sharerIds) {
		return {
			id: userId,
			address: directChildren?.address ?? null,
			allSubordinates: [],
			totalInvestmentSum: 0n,
			directSubordinates: [],
		};
	}

	// 解析 sharerIds 并转换为数组
	const directChildIds = directChildren.sharerIds
		.split(',')
		.map(Number)
		.filter(Boolean); // 过滤无效的数值

	// 批量查询下级的 totalInvestment
	const directChildUsers = await prisma.user.findMany({
		where: { id: { in: directChildIds } },
		select: { id: true, totalInvestment: true, address: true, sharerIds: true },
	});

	// 计算直接下级的投资总和
	const totalInvestmentSumFromDirect = directChildUsers.reduce(
		(sum, user) => sum + (user.totalInvestment ?? 0n),
		0n,
	);

	// 递归查询所有子用户的信息（并行执行）
	const subordinatesData = await Promise.all(
		directChildUsers.map((child) => getAllSubordinates(child.id)),
	);
	// 汇总所有下级 ID 和总投资金额
	const allSubordinates = subordinatesData.flatMap(
		(data) => data.allSubordinates,
	);
	const totalInvestmentSum = subordinatesData.reduce(
		(sum, data) => sum + data.totalInvestmentSum,
		totalInvestmentSumFromDirect,
	);
	const children = directChildUsers.map((child) => {
		const childData = subordinatesData.find((data) => data.id === child.id);
		console.log('childData123123', childData);
		return {
			id: child.id,
			address: child.address,
			children: childData ? childData.children : [],
		};
	});
	return {
		id: userId,
		address: directChildren?.address ?? null,
		allSubordinates: [...directChildIds, ...allSubordinates], // 包含直接和间接下级
		totalInvestmentSum,
		directSubordinates: directChildIds, // 直接下级
		children,
	};
};

export const getRootUsers = async () => {
	const rootUsers = await prisma.user.findMany({
		where: { isRoot: true },
		select: { id: true, address: true, sharerIds: true },
	});

	return rootUsers.map((rootUser) => ({
		id: rootUser.id,
		address: rootUser.address,
		shareIds: rootUser.sharerIds?.split(',').map(Number).filter(Boolean) || [],
		isRoot: true,
	}));
};
