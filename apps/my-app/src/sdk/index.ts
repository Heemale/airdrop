import { RPC, SUI_NETWORK } from "../config";
import { SuiClient } from "@mysten/sui/client";
import { AirdropClient } from "@local/airdrop-sdk/airdrop";
import { InviteClient } from "@local/airdrop-sdk/invite";
import { NodeClient } from "@local/airdrop-sdk/node";
import { Transaction } from "@mysten/sui/transactions";
import type { DevInspectResults } from "@mysten/sui/client";
import type { GetCoinMetadataParams, CoinMetadata } from "@mysten/sui/client";
import { getConfig } from "@local/airdrop-sdk/utils";

export const suiClient = new SuiClient({ url: RPC });
export const airdropClientV1 = new AirdropClient(
  suiClient,
  // @ts-ignore
  getConfig(SUI_NETWORK).package.outdated.find(
    (item) => item.version === 1,
  ).packageId,
);
export const inviteClientV1 = new InviteClient(
  suiClient,
  // @ts-ignore
  getConfig(SUI_NETWORK).package.outdated.find(
    (item) => item.version === 1,
  ).packageId,
);
export const nodeClientV1 = new NodeClient(
  suiClient,
  // @ts-ignore
  getConfig(SUI_NETWORK).package.outdated.find(
    (item) => item.version === 1,
  ).packageId,
);

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
