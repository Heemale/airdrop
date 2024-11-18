import { SuiClient } from '@mysten/sui/client';
import {
  ADMIN_SECRET,
  SUI_FULL_NODE,
  OWNER_SECRET,
  USER_SECRET,
} from '@/config';
import { AirdropClient } from '@local/airdrop-sdk/airdrop';
import { NodeClient } from '@local/airdrop-sdk/node';
import { InviteClient } from '@local/airdrop-sdk/invite';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

export const suiClient = new SuiClient({ url: SUI_FULL_NODE });

export const ownerKeypair = Ed25519Keypair.fromSecretKey(OWNER_SECRET);
export const adminKeypair = Ed25519Keypair.fromSecretKey(ADMIN_SECRET);
export const userKeypair = Ed25519Keypair.fromSecretKey(USER_SECRET);

export const airdropClient = new AirdropClient(suiClient);
export const nodeClient = new NodeClient(suiClient);
export const inviteClient = new InviteClient(suiClient);
