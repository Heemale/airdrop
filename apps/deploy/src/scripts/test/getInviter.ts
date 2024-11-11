import { CONFIG } from '@local/airdrop-sdk/utils/constants';
import { adminKeypair, airdropClient } from '@/sdk';

const getInviter = async () => {
  const res = await airdropClient.getInviter(
    CONFIG,
    adminKeypair.toSuiAddress(),
  );
  console.log({ res });
};

const main = async () => {
  await getInviter();
};

main().catch(({ message }) => {
  console.log({ message });
});
