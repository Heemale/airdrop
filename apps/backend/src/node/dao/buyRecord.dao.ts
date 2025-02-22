import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';
import {
	DynamicClientExtensionThis,
	Record,
	TypeMapCbDef,
	TypeMapDef,
} from '@prisma/client/runtime/library';

export const upsert = async <
	TypeMap extends TypeMapDef,
	TypeMapCb extends TypeMapCbDef,
	ExtArgs extends Record<string, any>,
	ClientOptions,
>(
	data: Prisma.BuyRecordCreateInput,
	tx?: Omit<
		DynamicClientExtensionThis<TypeMap, TypeMapCb, ExtArgs, ClientOptions>,
		'$extends' | '$transaction' | '$disconnect' | '$connect' | '$on' | '$use'
	>,
) => {
	const db = tx ?? prisma;
	return db.buyRecord.upsert({
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
