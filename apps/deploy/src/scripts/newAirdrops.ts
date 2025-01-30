import { signAndExecuteTransaction } from '@/sdk/utils';
import { ADMIN_CAP } from '@local/airdrop-sdk/utils';
import { adminKeypair, airdropClientV1 } from '@/sdk';

const newAirdrops = async () => {
  const tx = airdropClientV1.new(ADMIN_CAP);
  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('newAirdrops success');
};

const main = async () => {
  await newAirdrops();
};

main().catch(({ message }) => {
  console.log({ message });
});
