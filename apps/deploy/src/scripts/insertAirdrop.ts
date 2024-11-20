import { signAndExecuteTransaction } from '@/sdk/utils';
import { adminKeypair, airdropClient } from '@/sdk';
import { ADMIN_CAP, AIRDROPS } from '@local/airdrop-sdk/utils';

const insertAirdrop = async () => {
  const admin = adminKeypair.getPublicKey().toSuiAddress();

  // 定义空投参数
  const T = '0x2::sui::SUI'; // 替换为实际的代币类型，例如 SUI 或其他代币类型
  const airdrops = AIRDROPS; // 替换为实际的 Airdrop 对象 ID
  const round = BigInt(2); // 空投轮次
  const startTime = BigInt(Math.floor(Date.now() / 1000)); // 开始时间（当前时间戳）
  const endTime = startTime + BigInt(360000); // 结束时间（1小时后）
  const totalShares = BigInt(100); // 空投份额
  const totalBalance = BigInt(200000000); // 总金额
  const description = 'Example Airdrop 2'; // 空投描述
  const wallet = null; // 管理员钱包地址
  const amount = BigInt(200000000);
  const owner = adminKeypair.toSuiAddress(); // 使用管理员地址作为所有者

  // 调用 insert 方法创建添加空投的交易
  const tx = await airdropClient.insert(
    T,
    ADMIN_CAP,
    airdrops,
    round,
    startTime,
    endTime,
    totalShares,
    totalBalance,
    description,
    null,
    amount,
    owner,
  );

  // 签名并执行交易
  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('addAirdrop success');
};

const main = async () => {
  // 调用添加空投函数
  await insertAirdrop();
};

main().catch(({ message }) => {
  console.error({ message });
});
