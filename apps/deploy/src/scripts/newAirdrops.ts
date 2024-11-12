import { signAndExecuteTransaction } from '@/sdk/utils';
import { ADMIN_CAP } from '@local/airdrop-sdk/utils/constants';
import { adminKeypair, airdropClient } from '@/sdk';
import { COIN_TYPE } from '@/sdk/constants';

const newAirdrops = async () => {
  const tx = airdropClient.newAirdrops(COIN_TYPE, ADMIN_CAP);
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
