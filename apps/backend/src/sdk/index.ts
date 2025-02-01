import { RPC, SUI_NETWORK } from '@/config';
import { SuiClient } from '@mysten/sui/client';
import { AirdropClient } from '@local/airdrop-sdk/airdrop';
import { InviteClient } from '@local/airdrop-sdk/invite';
import { NodeClient } from '@local/airdrop-sdk/node';
import { getConfig } from '@local/airdrop-sdk/utils';

export const suiClient = new SuiClient({ url: RPC });
export const airdropClientV1 = new AirdropClient(
  suiClient,
  getConfig(SUI_NETWORK).package.outdated.find(
    (item) => item.version === 1,
  )?.packageId,
);
export const inviteClientV1 = new InviteClient(
  suiClient,
  getConfig(SUI_NETWORK).package.outdated.find(
    (item) => item.version === 1,
  )?.packageId,
);
export const nodeClientV1 = new NodeClient(
  suiClient,
  getConfig(SUI_NETWORK).package.outdated.find(
    (item) => item.version === 1,
  )?.packageId,
);

export const nodeClientV2 = new NodeClient(
  suiClient,
  getConfig(SUI_NETWORK).package.outdated.find(
    (item) => item.version === 2,
  )?.packageId,
);
