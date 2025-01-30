import { signAndExecuteTransaction } from '@/sdk/utils';
import { adminKeypair, airdropClientV1 } from '@/sdk';
import { ADMIN_CAP, AIRDROPS } from '@local/airdrop-sdk/utils';

const insertAirdrop = async () => {
  // const T =
  //   '0x317a8a0bbbb9f044e3c35d36858b3b5c9c30297dec88200c8a2ef5e75611e5e5::fbtc::FBTC'; // 替换为实际的代币类型，例如 SUI 或其他代币类型
  // // const startTime = BigInt(Math.floor(Date.now())) + BigInt(86400 * 1000 * 7); // 开始时间
  // // const endTime = startTime + BigInt(86400 * 1000 * 7); // 结束时间
  // const startTime = BigInt(Math.floor(Date.now())); // 开始时间
  // const endTime = startTime + BigInt(86400 * 1000 * 7); // 结束时间
  // const totalShares = BigInt(100); // 空投份额
  // const totalBalance = BigInt(10000000000); // 总金额
  // const description = 'FBTC Airdrop'; // 空投描述
  // const imageUrl = ''; // 空投图片 URL
  // const owner = adminKeypair.toSuiAddress(); // 使用管理员地址作为所有者

  const T =
    '0x317a8a0bbbb9f044e3c35d36858b3b5c9c30297dec88200c8a2ef5e75611e5e5::fusdt::FUSDT'; // 替换为实际的代币类型，例如 SUI 或其他代币类型
  // const startTime = BigInt(Math.floor(Date.now())) + BigInt(86400 * 1000 * 7); // 开始时间
  // const endTime = startTime + BigInt(86400 * 1000 * 7); // 结束时间
  const startTime = BigInt(Math.floor(Date.now())); // 开始时间
  const endTime = startTime + BigInt(86400 * 1000 * 15); // 结束时间
  const totalShares = BigInt(100); // 空投份额
  const totalBalance = BigInt(3000000); // 总金额
  const description = 'FUSDT Airdrop'; // 空投描述
  const imageUrl = ''; // 空投图片 URL
  const owner = adminKeypair.toSuiAddress(); // 使用管理员地址作为所有者

  const tx = await airdropClientV1.insert(
    T,
    ADMIN_CAP,
    AIRDROPS,
    startTime,
    endTime,
    totalShares,
    totalBalance,
    description,
    null,
    imageUrl,
    totalBalance,
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
