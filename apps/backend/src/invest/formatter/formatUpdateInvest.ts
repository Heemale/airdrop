import { UpdateInvestSummary } from '@local/airdrop-sdk/invest';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export interface FormatUpdateGainsReturns {
	address: string;
	totalInvestment: bigint;
	timestamp: bigint;
}

export const formatUpdateInvest = (
	eventObject: UpdateInvestSummary,
): FormatUpdateGainsReturns => {
	const { address, totalInvestment, timestampMs } = eventObject;
	return {
		address: address.toLowerCase(),
		totalInvestment,
		timestamp: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
	};
};
