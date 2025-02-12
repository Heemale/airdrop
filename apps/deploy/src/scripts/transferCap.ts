import { Transaction } from '@mysten/sui/transactions';
import { signAndExecuteTransaction } from '@/sdk/utils';
import { ADMIN_CAP, UPGRADE_CAP } from '@/sdk/constants';
import { ownerKeypair, adminKeypair } from '@/sdk';

const objects = [ADMIN_CAP, UPGRADE_CAP];

const receiver = adminKeypair.toSuiAddress();

const transferCap = async () => {
  const tx = new Transaction();

  objects.map((item) => {
    tx.transferObjects([tx.object(item)], tx.pure.address(receiver));
  });

  const res = await signAndExecuteTransaction(tx, ownerKeypair);
  console.log({ res });
  console.log('TransferCap success');
};

const main = async () => {
  await transferCap();
};

main().catch(({ message }) => {
  console.log({ message });
});
