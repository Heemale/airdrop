import { CONFIG } from '@local/airdrop-sdk/utils/constants';
import { airdropClient, ownerKeypair, userKeypair } from '@/sdk';
import { devInspectTransactionBlock } from '@/sdk/utils';

const inviter = async () => {
  const tx = await airdropClient.invite(CONFIG, ownerKeypair.toSuiAddress());
  const res = await devInspectTransactionBlock(tx, userKeypair.toSuiAddress());
  console.log({ res });
};

const main = async () => {
  await inviter();
};

main().catch(({ message }) => {
  console.log({ message });
});
