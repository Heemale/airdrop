import { signAndExecuteTransaction } from '@/sdk/utils';
import { adminKeypair, airdropClient } from '@/sdk';
import { ADMIN_CAP, AIRDROPS } from '@/sdk/constants';

const airdrops = [
  {
    coinType:
      '0x317a8a0bbbb9f044e3c35d36858b3b5c9c30297dec88200c8a2ef5e75611e5e5::fbtc::FBTC',
    adminCap: ADMIN_CAP,
    startTime: BigInt(Math.floor(Date.now())),
    endTime: BigInt(Math.floor(Date.now())) + BigInt(86400 * 1000 * 15),
    totalShares: BigInt(100),
    totalBalance: BigInt(3000000),
    description: 'FBTC',
    imageUrl: '',
  },
];

const insertAirdrops = async () => {
  // 代币类型
  const coinType =
    '0x317a8a0bbbb9f044e3c35d36858b3b5c9c30297dec88200c8a2ef5e75611e5e5::fbtc::FBTC';
  // 开始时间
  const startTime = BigInt(Math.floor(Date.now()));
  // 结束时间
  const endTime = startTime + BigInt(86400 * 1000 * 15);
  // 空投份额
  const totalShares = BigInt(100);
  // 总金额
  const totalBalance = BigInt(3000000);
  // 空投描述
  const description = 'FBTC';
  // 空投图片 URL
  const imageUrl = '';
  // 使用管理员地址作为所有者
  const owner = adminKeypair.toSuiAddress();

  const tx = await airdropClient.insert(
    coinType,
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

  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('AddAirdrops success');
};

const main = async () => {
  // 调用添加空投函数
  await insertAirdrops();
};

main().catch(({ message }) => {
  console.error({ message });
});
