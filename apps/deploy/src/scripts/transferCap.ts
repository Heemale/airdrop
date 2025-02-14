import { Transaction } from '@mysten/sui/transactions';
import { signAndExecuteTransaction } from '@/sdk/utils';
import { ADMIN_CAP, UPGRADE_CAP } from '@/sdk/constants';
import { adminKeypair } from '@/sdk';

const objects = [ADMIN_CAP, UPGRADE_CAP];

const receiver = '';

const transferCap = async () => {
  const tx = new Transaction();

  objects.map((item) => {
    tx.transferObjects([tx.object(item)], tx.pure.address(receiver));
  });

  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('TransferCap success');
};

const main = async () => {
  await transferCap();
};

main().catch(({ message }) => {
  console.log({ message });
});
