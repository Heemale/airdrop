import { signAndExecuteTransaction } from '@/sdk/utils';
import { ADMIN_CAP, INVEST, NODES, PACKAGE_ID } from '@/sdk/constants';
import { adminKeypair } from '@/sdk';
import { MODULE_CLOB } from '@local/airdrop-sdk/airdrop';
import { Transaction } from '@mysten/sui/transactions';

const data = [
  {
    address: '',
    fixTotalInvestment: '',
    fixTotalGains: '',
    fixLastInvestment: '',
    fixAccumulatedGains: '',
  },
];

const main = async () => {
  const tx = new Transaction();

  data.map((item) => {
    const {
      address,
      fixTotalInvestment,
      fixTotalGains,
      fixLastInvestment,
      fixAccumulatedGains,
    } = item;
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::modify_invest`,
      arguments: [
        tx.object(ADMIN_CAP),
        tx.object(INVEST),
        tx.object(NODES),
        tx.pure.address(address),
        tx.pure.u64(fixTotalInvestment),
        tx.pure.u64(fixTotalGains),
        tx.pure.u64(fixLastInvestment),
        tx.pure.u64(fixAccumulatedGains),
      ],
    });
  });

  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('modify_invest success');
};

main().catch(({ message }) => {
  console.log({ message });
});
