import { signAndExecuteTransaction } from '@/sdk/utils';
import { adminKeypair, airdropClient } from '@/sdk';
import { ADMIN_CAP } from '@local/airdrop-sdk/utils';

const newNode = async () => {
  const T = '0x2::sui::SUI';
  const admin = adminKeypair.getPublicKey().toSuiAddress();
  const tx = airdropClient.newNode(T, ADMIN_CAP, admin);
  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('newNodes success');
};

const main = async () => {
  await newNode();
};

main().catch(({ message }) => {
  console.log({ message });
});
