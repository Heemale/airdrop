import { INVITE } from '@local/airdrop-sdk/utils';
import { inviteClient, userKeypair } from '@/sdk';

const inviters = async () => {
  const res = await inviteClient.inviters(INVITE, userKeypair.toSuiAddress());
  console.log({ res });
};

const main = async () => {
  await inviters();
};

main().catch(({ message }) => {
  console.log({ message });
});
