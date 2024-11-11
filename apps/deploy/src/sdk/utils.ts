import { Transaction } from '@mysten/sui/transactions';
import { suiClient } from '.';
import { GetTransactionBlockParams } from '@mysten/sui/client';
import type { Signer } from '@mysten/sui/cryptography';

export const devInspectTransactionBlock = async (
  tx: Transaction,
  sender: string,
) => {
  return suiClient.devInspectTransactionBlock({
    transactionBlock: tx,
    sender,
  });
};

export const signAndExecuteTransaction = async (
  tx: Transaction,
  signer: Signer,
) => {
  return suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer,
  });
};

export const submit = async (tx: Transaction, keypair: any) => {
  const devInspect = await devInspectTransactionBlock(
    tx,
    keypair.toSuiAddress(),
  );
  if (devInspect.effects.status.status === 'failure') {
    throw new Error(devInspect.effects.status.error);
  }
  return await signAndExecuteTransaction(tx, keypair);
};

export const getTransactionBlock = async (input: GetTransactionBlockParams) => {
  return suiClient.getTransactionBlock(input);
};
