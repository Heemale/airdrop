import { INVITE } from '@local/airdrop-sdk/utils';
import { adminKeypair, inviteClientV1, userKeypair } from '@/sdk';
import { devInspectTransactionBlock } from '@/sdk/utils';

const bind = async () => {
  const admin = adminKeypair.getPublicKey().toSuiAddress();
  const tx = await inviteClientV1.bind(INVITE, admin);
  const res = await devInspectTransactionBlock(tx, userKeypair.toSuiAddress());
  console.log({ res });
};

const main = async () => {
  await bind();
};

main().catch(({ message }) => {
  console.log({ message });
});
