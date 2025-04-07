import { Prisma } from '@prisma/client';
import { upsert } from '@/airdrop/dao/airdrop.dao';
import { upsertCoinMeta } from '@/airdrop/dao/coinMeta.dao';
import { getCoinMetaData } from '@/sdk';
import { isHexString } from '@/utils';

export const handleAirdropChange = async (event: Prisma.AirdropCreateInput) => {
  const coinType = isHexString(event.coinType)
    ? event.coinType
    : '0x' + event.coinType;

  const coinMetaData = await getCoinMetaData({ coinType });
  await upsert(event);
  await upsertCoinMeta(
    coinMetaData.name,
    coinMetaData.symbol,
    coinMetaData.description,
    coinMetaData.decimals,
    coinMetaData.iconUrl,
    coinMetaData.id,
    event.coinType,
  );
};
