import { UpdateGainsSummary } from '@local/airdrop-sdk/invest';
import { convertSmallToLarge, toFixed } from '@/utils/math';

export interface FormatUpdateGainsReturns {
	address: string;
	totalGains: bigint;
	timestamp: bigint;
}

export const formatUpdateGains = (
	eventObject: UpdateGainsSummary,
): FormatUpdateGainsReturns => {
	const { address, totalGains, timestampMs } = eventObject;
	return {
		address: address.toLowerCase(),
		totalGains,
		timestamp: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
	};
};
