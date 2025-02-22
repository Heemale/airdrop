import { FormatUpdateGainsReturns } from '@/invest/formatter/formatUpdateInvest';
import { findUserByAddress, upsertUser } from '@/user/dao/user.dao';

export const handleUpdateInvest = async (event: FormatUpdateGainsReturns) => {
	const { address, totalInvestment, timestamp } = event;

	const user = await findUserByAddress(address);
	if (user.totalInvestmentUpdateAt < BigInt(timestamp)) {
		await upsertUser({
			totalInvestment,
			totalInvestmentUpdateAt: timestamp,
		});
	}
};
