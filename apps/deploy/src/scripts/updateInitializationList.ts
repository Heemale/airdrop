import { signAndExecuteTransaction } from '@/sdk/utils';
import {
  ADMIN_CAP,
  AIRDROPS,
  GLOBAL,
  INVEST,
  INVITE,
  LIMITS,
  NODES,
  PACKAGE_ID,
} from '@/sdk/constants';
import { adminKeypair } from '@/sdk';
import { MODULE_CLOB } from '@local/airdrop-sdk/airdrop';
import { Transaction } from '@mysten/sui/transactions';

const objects = [INVITE, NODES, AIRDROPS, LIMITS, INVEST];

const main = async () => {
  const tx = new Transaction();

  objects.map((item) => {
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::update_initialization_list`,
      arguments: [
        tx.object(ADMIN_CAP),
        tx.object(GLOBAL),
        tx.object(item),
        tx.pure.bool(true),
      ],
    });
  });

  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('UpdateInitializationList success');
};

main().catch(({ message }) => {
  console.log({ message });
});
