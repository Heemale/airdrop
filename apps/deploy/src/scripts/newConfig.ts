import { signAndExecuteTransaction } from '@/sdk/utils';
import { ADMIN_CAP } from '@local/airdrop-sdk/utils/constants';
import { adminKeypair, airdropClient, ownerKeypair } from '@/sdk';

const newConfig = async () => {
  const tx = airdropClient.newConfig(
    ADMIN_CAP,
    ownerKeypair.toSuiAddress(),
    BigInt(500),
    adminKeypair.toSuiAddress(),
  );
  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('newConfig success');
};

const main = async () => {
  await newConfig();
};

main().catch(({ message }) => {
  console.log({ message });
});
