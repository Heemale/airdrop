import { getConfig } from '@local/airdrop-sdk/utils';
import { PACKAGE_VERSION, SUI_NETWORK } from '@/config';

export const config = getConfig(SUI_NETWORK);

export const PACKAGE_ID = config.package.outdated.find(
  (item) => item.version === PACKAGE_VERSION,
)?.packageId!;

export const {
  ADMIN_CAP,
  UPGRADE_CAP,
  INVITE,
  NODES,
  AIRDROPS,
  GLOBAL,
  LIMITS,
  INVEST,
  PAY_COIN_TYPE,
} = config;

export const COIN_TYPE = '0x2::sui::SUI';
