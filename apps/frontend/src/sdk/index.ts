import { RPC, SUI_NETWORK } from '@/config';
import { SuiClient } from '@mysten/sui/client';
import { AirdropClient } from '@local/airdrop-sdk/airdrop';
import { InviteClient } from '@local/airdrop-sdk/invite';
import { NodeClient } from '@local/airdrop-sdk/node';
import type { GetCoinMetadataParams, CoinMetadata } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import type { DevInspectResults } from '@mysten/sui/client';
import { getConfig } from '@local/airdrop-sdk/utils';
// 获取配置
export const PACKAGE_ID =
  '0x17192ccd391112180395ca60d6cd68ad97816ed1a8557e83c995c43c24b7a67f';
export const ADMIN_CAP =
  '0x7e0959ceb96b5d20959d219e86c1bd3f5c1411c22dc60b5b82511253f0e4874b';
export const UPGRADE_CAP =
  '0x371567cbf6ee6d0f2ba8b9c62151533cda0dcb3ffa7c57736370a8f8628e7211';
export const INVITE =
  '0x9a1df5c1e15a40534798dc2809919c1771078f8bb618ac4a7ef3cf7882c8c4c8';
export const NODES =
  '0x9982d11548a495a92d17fa144fd1b13c3115f1b789890ef80d1c256616bd7ea4';
export const AIRDROPS =
  '0xedd84d036dfda620c26c402edbe786473e0467a0a87aca7fe099c368768cfdb4';
export const PAY_COIN_TYPE = '0x2::sui::SUI';
export const GLOBAL = '';
export const LIMITS = '';
export const INVEST = '';

const config = getConfig(SUI_NETWORK);
const version = Number(process.env.NEXT_PUBLIC_VERISON);
const packageId = config.package.outdated.find(
  (item) => item.version === version,
)?.packageId;

export const suiClient = new SuiClient({ url: RPC });

// 使用 getConfig 获取动态的配置来初始化 SDK 客户端
export const airdropClientV2 = new AirdropClient(suiClient, packageId!);
export const inviteClientV2 = new InviteClient(suiClient, packageId!);
export const nodeClientV2 = new NodeClient(suiClient, packageId!);

// 获取 Coin 元数据
export const getCoinMetaData = async (
  input: GetCoinMetadataParams,
): Promise<CoinMetadata | null> => {
  return suiClient.getCoinMetadata(input);
};

// 执行事务块的检查
export const devInspectTransactionBlock = async (
  tx: Transaction,
  sender: string,
): Promise<DevInspectResults> => {
  return await suiClient.devInspectTransactionBlock({
    transactionBlock: tx,
    sender,
  });
};

// 执行事务
export const devTransaction = async (tx: Transaction, sender: string) => {
  const res = await devInspectTransactionBlock(tx, sender);
  // @ts-ignore
  if (res.effects.status.status === 'failure') {
    // @ts-ignore
    throw new Error(res.effects.status.error);
  }
};
