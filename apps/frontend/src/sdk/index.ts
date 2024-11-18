import { RPC } from '@/config';
import { SuiClient } from '@mysten/sui/client';
import { AirdropClient } from '@local/airdrop-sdk/airdrop';
import { InviteClient } from '@local/airdrop-sdk/invite';
import { NodeClient } from '@local/airdrop-sdk/node';

export const suiClient = new SuiClient({ url: RPC });
export const airdropClient = new AirdropClient(suiClient);
export const inviteClient = new InviteClient(suiClient);
export const nodeClient = new NodeClient(suiClient);
