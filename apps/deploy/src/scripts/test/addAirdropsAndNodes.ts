import { signAndExecuteTransaction } from '@/sdk/utils';
import { adminKeypair, airdropClient } from '@/sdk';
import { AIRDROPS, ADMIN_CAP, NODES } from '@local/airdrop-sdk/utils';

const addTestAirdropsAndNodes = async () => {
  const nodes = NODES; // 替换为实际的节点存储地址
  const rank = 1; // 节点等级
  const name = 'Gold Node'; // 节点名称
  const description = 'High-performance node with premium features.'; // 节点描述
  const limit = BigInt(100); // 每人最大购买数量
  const price = BigInt(1_000_000_000); // 价格 (1 SUI = 10^9 最小单位)
  const total_quantity = BigInt(500); // 总供应量

  // 调用 insertNode 方法
  const result = await airdropClient.insertNode(
    ADMIN_CAP,
    nodes,
    rank,
    name,
    description,
    limit,
    price,
    total_quantity,
  );
  const res = await signAndExecuteTransaction(result, adminKeypair);

  console.log('Node inserted successfully:', res);

  // 获取当前时间
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;

  // 示例空投数据
  const airdropParams = {
    T: '0x2::sui::SUI', // 替换为实际的代币类型
    adminCap: ADMIN_CAP, // 管理员权限对象ID
    airdrops: AIRDROPS, // 空投集合对象ID
    round: BigInt(1), // 空投轮次，通常从1开始
    startTime: BigInt(Date.now()), // 空投开始时间（毫秒级时间戳）
    endTime: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000), // 结束时间（+7天）
    totalShares: BigInt(10000), // 总份额
    totalBalance: BigInt(1000000), // 空投总金额，单位可能是最小货币单位
    description: 'Test Airdrop for Round 1', // 描述信息
    wallet:
      '0x70ed518ea504e4a63b9b1a5fbdd21d4562fe7519f6ca1361db4c5f125e607344', // 管理员钱包地址
    owner: adminKeypair.toSuiAddress(), // 空投的所有者地址
  };

  // 使用示例
  const result1 = await airdropClient.insert(
    airdropParams.T,
    airdropParams.adminCap,
    airdropParams.airdrops,
    airdropParams.round,
    airdropParams.startTime,
    airdropParams.endTime,
    airdropParams.totalShares,
    airdropParams.totalBalance,
    airdropParams.description,
    airdropParams.wallet,
    airdropParams.owner,
  );
  const res1 = await signAndExecuteTransaction(result1, adminKeypair);

  console.log('Node inserted successfully:', res1);
};
// 调用脚本
addTestAirdropsAndNodes();
