import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { PACKAGE_ID } from '../utils/constants';
import { MODULE_CLOB } from './utils/constants';
import type { DevInspectResults } from '@mysten/sui/client';
import { toHexString } from './utils';

export class AirdropClient {
  constructor(public suiClient: SuiClient) {}

  newConfig(
    admin_cap: string,
    root: string,
    inviter_fee: bigint,
    receiver: string,
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::new_config`,
      arguments: [
        tx.object(admin_cap),
        tx.pure.address(root),
        tx.pure.u64(inviter_fee),
        tx.pure.address(receiver),
      ],
    });
    return tx;
  }

  newAirdrops(T: string, admin_cap: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [T],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::new_airdrops`,
      arguments: [tx.object(admin_cap)],
    });
    return tx;
  }

  invite(config: string, inviter: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::invite`,
      arguments: [tx.object(config), tx.pure.address(inviter)],
    });
    return tx;
  }

  async buyNode(
    T: string,
    config: string,
    rank: bigint,
    c: string | undefined,
    owner: string,
  ): Promise<Transaction> {
    const tx = new Transaction();
    if (c) {
      tx.moveCall({
        typeArguments: [T],
        target: `${PACKAGE_ID}::${MODULE_CLOB}::buy_node`,
        arguments: [tx.object(config), tx.pure.u8(Number(rank)), tx.object(c)],
      });
    } else {
      const coins = await this.suiClient.getCoins({
        owner,
        coinType: T,
      });
      if (!coins.data.length) throw new Error('No coins.');
      if (coins.data.length > 1) {
        tx.mergeCoins(
          tx.object(coins.data[0]['coinObjectId']),
          coins.data.slice(1).map((e: any) => tx.object(e['coinObjectId'])),
        );
      }
      const coin = tx.object(coins.data[0]['coinObjectId']); //合并后使用
      tx.moveCall({
        typeArguments: [T],
        target: `${PACKAGE_ID}::${MODULE_CLOB}::buy_node`,
        arguments: [tx.object(config), tx.pure.u64(rank), coin],
      });
    }
    return tx;
  }

  async getInviter(config: string, user: string) {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::get_inviter`,
      arguments: [tx.object(config), tx.pure.address(user)],
    });
    const res: DevInspectResults =
      await this.suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: normalizeSuiAddress('0x0'),
      });
    // @ts-ignore
    const value = res?.results[0]?.returnValues[0][0];
    return '0x' + toHexString(value);
  }
}
