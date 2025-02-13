import { signAndExecuteTransaction } from '@/sdk/utils';
import { ADMIN_CAP, GLOBAL, PACKAGE_ID } from '@/sdk/constants';
import { adminKeypair } from '@/sdk';
import { MODULE_CLOB } from '@local/airdrop-sdk/airdrop';
import { Transaction } from '@mysten/sui/transactions';

const main = async () => {
  const tx = new Transaction();

  tx.moveCall({
    typeArguments: [],
    target: `${PACKAGE_ID}::${MODULE_CLOB}::un_pause`,
    arguments: [tx.object(ADMIN_CAP), tx.object(GLOBAL)],
  });

  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('UpdateInitializationList success');
};

main().catch(({ message }) => {
  console.log({ message });
});
