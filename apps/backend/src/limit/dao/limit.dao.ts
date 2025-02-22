import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';

export const upsert = (data: Prisma.SpecialLimitCreateInput) => {
	return prisma.specialLimit.upsert({
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
