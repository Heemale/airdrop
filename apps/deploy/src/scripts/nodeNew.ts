import { signAndExecuteTransaction } from '@/sdk/utils';
import { adminKeypair ,airdropClient} from '@/sdk'; // 假设 adminKeypair 是管理者的密钥
import { ADMIN_CAP } from '@local/airdrop-sdk/utils/constants';
import { COIN_TYPE } from '@/sdk/constants';

const nodeNew = async () => {
  const tx = airdropClient.newAirdrops(COIN_TYPE, ADMIN_CAP);
  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('newNodes success');
};


const main = async () => {
  await nodeNew();
};

main().catch(({ message }) => {
  console.log({ message });
});
