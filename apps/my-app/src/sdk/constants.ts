import { getConfig } from "@local/airdrop-sdk/utils";
import { SUI_NETWORK } from "@/config";

export const config = getConfig(SUI_NETWORK);

export const PACKAGE_ID = config.package.packageId;

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
