import { Transaction } from '@mysten/sui/transactions';
import { signAndExecuteTransaction } from '@/sdk/utils';
import { ADMIN_CAP } from '@local/airdrop-sdk/utils';
import { ownerKeypair, adminKeypair } from '@/sdk';

const transferCap = async () => {
  const tx = new Transaction();
  tx.transferObjects(
    [tx.object(ADMIN_CAP)],
    tx.pure.address(adminKeypair.toSuiAddress()),
  );
  // tx.transferObjects(
  //     [tx.object(UPGRADE_CAP)],
  //     tx.pure.address(adminKeypair.toMgoAddress()),
  // );
  const res = await signAndExecuteTransaction(tx, ownerKeypair);
  console.log({ res });
  console.log('transferCap success');
};

const main = async () => {
  await transferCap();
};

main().catch(({ message }) => {
  console.log({ message });
});
