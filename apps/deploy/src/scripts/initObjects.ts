import { signAndExecuteTransaction } from '@/sdk/utils';
import { ADMIN_CAP, PACKAGE_ID, PAY_COIN_TYPE } from '@/sdk/constants';
import { adminKeypair } from '@/sdk';
import { MODULE_CLOB } from '@local/airdrop-sdk/airdrop';
import { Transaction } from '@mysten/sui/transactions';

const main = async () => {
  const admin = adminKeypair.getPublicKey().toSuiAddress();

  const tx = new Transaction();

  tx.moveCall({
    typeArguments: [],
    target: `${PACKAGE_ID}::${MODULE_CLOB}::new_invite`,
    arguments: [
      tx.object(ADMIN_CAP),
      tx.pure.address(admin),
      tx.pure.u64(BigInt(500)),
    ],
  });

  tx.moveCall({
    typeArguments: [PAY_COIN_TYPE],
    target: `${PACKAGE_ID}::${MODULE_CLOB}::new_node`,
    arguments: [tx.object(ADMIN_CAP), tx.pure.address(admin)],
  });

  tx.moveCall({
    typeArguments: [],
    target: `${PACKAGE_ID}::${MODULE_CLOB}::new`,
    arguments: [tx.object(ADMIN_CAP)],
  });

  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('Init objects success');
};

main().catch(({ message }) => {
  console.log({ message });
});
