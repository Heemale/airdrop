import { RPC } from '@/config';
import { SuiClient } from '@mysten/sui/client';
import { AirdropClient } from '@local/airdrop-sdk/airdrop';
import { InviteClient } from '@local/airdrop-sdk/invite';
import { NodeClient } from '@local/airdrop-sdk/node';
import { PACKAGE_ID, PACKAGE_ID_V1, PACKAGE_ID_V2 } from '@/sdk/contants';
import { GlobalClient } from '@local/airdrop-sdk/global';
import { InvestClient } from '@local/airdrop-sdk/invest';
import { LimitClient } from '@local/airdrop-sdk/limit';
import type { GetCoinMetadataParams, CoinMetadata } from '@mysten/sui/client';

export const suiClient = new SuiClient({ url: RPC });

export const airdropClientV1 = new AirdropClient(suiClient, PACKAGE_ID_V1);
export const inviteClientV1 = new InviteClient(suiClient, PACKAGE_ID_V1);
export const nodeClientV1 = new NodeClient(suiClient, PACKAGE_ID_V1);

export const airdropClientV2 = new AirdropClient(suiClient, PACKAGE_ID_V2);
export const globalClientV2 = new GlobalClient(suiClient, PACKAGE_ID_V2);
export const investClientV2 = new InvestClient(suiClient, PACKAGE_ID_V2);
export const inviteClientV2 = new InviteClient(suiClient, PACKAGE_ID_V2);
export const limitClientV2 = new LimitClient(suiClient, PACKAGE_ID_V2);
export const nodeClientV2 = new NodeClient(suiClient, PACKAGE_ID_V2);

export const airdropClient = new AirdropClient(suiClient, PACKAGE_ID);
export const globalClient = new GlobalClient(suiClient, PACKAGE_ID);
export const investClient = new InvestClient(suiClient, PACKAGE_ID);
export const inviteClient = new InviteClient(suiClient, PACKAGE_ID);
export const limitClient = new LimitClient(suiClient, PACKAGE_ID);
export const nodeClient = new NodeClient(suiClient, PACKAGE_ID);

export const getCoinMetaData = async (
  input: GetCoinMetadataParams,
): Promise<CoinMetadata | null> => {
  return suiClient.getCoinMetadata(input);
};
