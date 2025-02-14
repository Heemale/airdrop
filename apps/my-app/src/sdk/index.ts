import { RPC } from "@/config";
import { SuiClient } from "@mysten/sui/client";
import { AirdropClient } from "@local/airdrop-sdk/airdrop";
import { InviteClient } from "@local/airdrop-sdk/invite";
import { NodeClient } from "@local/airdrop-sdk/node";
import { Transaction } from "@mysten/sui/transactions";
import type { DevInspectResults } from "@mysten/sui/client";
import type { GetCoinMetadataParams, CoinMetadata } from "@mysten/sui/client";
import { PACKAGE_ID } from "@/sdk/constants";

export const suiClient = new SuiClient({ url: RPC });
export const airdropClient = new AirdropClient(suiClient, PACKAGE_ID);
export const inviteClient = new InviteClient(suiClient, PACKAGE_ID);
export const nodeClient = new NodeClient(suiClient, PACKAGE_ID);

export const getCoinMetaData = async (
  input: GetCoinMetadataParams,
): Promise<CoinMetadata | null> => {
  return suiClient.getCoinMetadata(input);
};

export const devInspectTransactionBlock = async (
  tx: Transaction,
  sender: string,
): Promise<DevInspectResults> => {
  return await suiClient.devInspectTransactionBlock({
    transactionBlock: tx,
    sender,
  });
};

export const devTransaction = async (tx: Transaction, sender: string) => {
  const res = await devInspectTransactionBlock(tx, sender);
  // @ts-ignore
  if (res.effects.status.status === "failure") {
    // @ts-ignore
    throw new Error(res.effects.status.error);
  }
};
