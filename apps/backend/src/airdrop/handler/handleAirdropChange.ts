import { Prisma } from '@prisma/client';
import { upsert } from '@/airdrop/dao/airdrop.dao';
import { upsertCoinMeta } from '@/airdrop/dao/coinMeta.dao';

import { prisma } from '@/config/prisma';
import { consoleError } from '@/log';

import { getCoinMetaData } from '@/sdk';
import { isHexString } from '@/utils';

export const handleAirdropChange = async (event: Prisma.AirdropCreateInput) => {
  try {
    await prisma.$transaction(async (tx) => {
      const coinType = isHexString(event.coinType)
        ? event.coinType
        : '0x' + event.coinType;

      const coinMetaData = await getCoinMetaData({ coinType });
      await upsert(event, tx);
      await upsertCoinMeta(
        coinMetaData.name,
        coinMetaData.symbol,
        coinMetaData.description,
        coinMetaData.decimals,
        coinMetaData.iconUrl,
        coinMetaData.id,
        event.coinType,
        tx,
      );
    });
  } catch (error) {
    consoleError('Error in handleAirdropChange:', error.message);
    throw error;
  }
};
