import { INVITE ,GLOBAL} from '@/sdk/constants';
import { adminKeypair, inviteClient, userKeypair } from '@/sdk';
import { devInspectTransactionBlock } from '@/sdk/utils';

const bind = async () => {
  const admin = adminKeypair.getPublicKey().toSuiAddress();
  const tx = inviteClient.bind_v2(INVITE, admin,GLOBAL);
  const res = await devInspectTransactionBlock(tx, userKeypair.toSuiAddress());
  console.log({ res });
};

const main = async () => {
  await bind();
};

main().catch(({ message }) => {
  console.log({ message });
});
