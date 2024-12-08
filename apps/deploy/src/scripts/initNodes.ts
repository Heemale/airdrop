import { signAndExecuteTransaction } from '@/sdk/utils';
import { ADMIN_CAP, NODES, PACKAGE_ID } from '@local/airdrop-sdk/utils';
import { adminKeypair } from '@/sdk';
import { MODULE_CLOB } from '@local/airdrop-sdk/airdrop';
import { Transaction } from '@mysten/sui/transactions';

const nodes = [
  {
    name: '星星之火',
    description: '普通权益',
    limit: 1,
    price: 100000000,
    totalQuantity: 999999999,
  },
  {
    name: '荣耀英雄',
    description: '初级权益',
    limit: 2,
    price: 1000000000,
    totalQuantity: 384,
  },
  {
    name: '永恒天使',
    description: '中级权益',
    limit: 5,
    price: 10000000000,
    totalQuantity: 64,
  },
  {
    name: '先驱创世',
    description: '最高权益',
    limit: 10,
    price: 100000000000,
    totalQuantity: 8,
  },
];

const main = async () => {
  const tx = new Transaction();

  nodes.map((node) => {
    const { name, description, limit, price, totalQuantity } = node;
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::insert_node`,
      arguments: [
        tx.object(ADMIN_CAP),
        tx.object(NODES),
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.u64(limit),
        tx.pure.u64(price),
        tx.pure.u64(totalQuantity),
      ],
    });
  });

  const res = await signAndExecuteTransaction(tx, adminKeypair);
  console.log({ res });
  console.log('init nodes success');
};

main().catch(({ message }) => {
  console.log({ message });
});
