import { signAndExecuteTransaction } from '@/sdk/utils';
import { ADMIN_CAP } from '@local/airdrop-sdk/utils';
import { adminKeypair, airdropClientV1 } from '@/sdk';

const newInvite = async () => {
  const admin = adminKeypair.getPublicKey().toSuiAddress();
  const tx = airdropClientV1.newInvite(ADMIN_CAP, admin, BigInt(500));
  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('newInvite success');
};

const main = async () => {
  await newInvite();
};

main().catch(({ message }) => {
  console.log({ message });
});
