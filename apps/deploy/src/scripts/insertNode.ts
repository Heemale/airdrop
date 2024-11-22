import { signAndExecuteTransaction } from '@/sdk/utils';
import { adminKeypair, airdropClient } from '@/sdk';
import { ADMIN_CAP, NODES } from '@local/airdrop-sdk/utils';

const insertNode = async () => {
  const nodes = NODES; // 替换为实际的 Nodes 对象 ID
  const name = 'Example Node 1'; // 节点名称
  const description = 'This is an example node 1'; // 节点描述
  const limit = BigInt(1); // 每轮空投购买次数限制
  const price = BigInt(1000000); // 节点价格
  const total_quantity = BigInt(100); // 总数量
  const tx = airdropClient.insertNode(
    ADMIN_CAP,
    nodes,
    name,
    description,
    limit,
    price,
    total_quantity,
  );
  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('newNodes success');
};

const main = async () => {
  // 调用添加节点函数
  await insertNode();
};

main().catch(({ message }) => {
  console.error({ message });
});
