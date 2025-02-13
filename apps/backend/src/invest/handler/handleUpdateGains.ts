import { findUserByAddress, upsertUser } from '@/user/dao/user.dao';
import { FormatUpdateGainsReturns } from '@/invest/formatter/formatUpdateGains';

export const handleUpdateGains = async (event: FormatUpdateGainsReturns) => {
  const { address, totalGains, timestamp } = event;

  const user = await findUserByAddress(address);
  if (user.totalGainsUpdateAt < BigInt(timestamp)) {
    await upsertUser({
      totalGains,
      totalGainsUpdateAt: timestamp,
    });
  }
};
