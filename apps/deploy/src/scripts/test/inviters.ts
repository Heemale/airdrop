import { INVITE } from '@local/airdrop-sdk/utils';
import { inviteClientV1, userKeypair } from '@/sdk';

const inviters = async () => {
  const res = await inviteClientV1.inviters(INVITE, userKeypair.toSuiAddress());
  console.log({ res });
};

const main = async () => {
  await inviters();
};

main().catch(({ message }) => {
  console.log({ message });
});
