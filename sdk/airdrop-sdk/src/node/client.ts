import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID } from '../utils/constants';
import { MODULE_CLOB } from './utils/constants';
import type {
  PaginationArguments,
  PaginatedEvents,
  OrderArguments,
} from '@mysten/sui/client';

export class NodeClient {
  constructor(public suiClient: SuiClient) {}

  async buy(
    T: string,
    config: string,
    rank: bigint,
    wallet: string | undefined,
    owner: string,
  ): Promise<Transaction> {
    const tx = new Transaction();
    if (wallet) {
      tx.moveCall({
        typeArguments: [T],
        target: `${PACKAGE_ID}::${MODULE_CLOB}::buy`,
        arguments: [
          tx.object(config),
          tx.pure.u8(Number(rank)),
          tx.object(wallet),
        ],
      });
    } else {
      // @ts-ignore
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

  async queryEvents(
    eventName: string,
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ) {
    // @ts-ignore
    return this.suiClient.queryEvents({
      query: {
        MoveEventType: `${PACKAGE_ID}::${MODULE_CLOB}::${eventName}`,
      },
      ...input,
    });
  }

  createEventMapper<T>(customMapping: (rawEvent: any) => T) {
    return (event: any) => ({
      ...customMapping(event.parsedJson),
      eventId: event.id,
      timestampMs: event.timestampMs,
    });
  }

  handleEventReturns<T>(resp: any, customMapping: (rawEvent: any) => T) {
    const eventMapper = this.createEventMapper(customMapping);
    const data = resp.data.map(eventMapper);
    return {
      data,
      nextCursor: resp.nextCursor,
      hasNextPage: resp.hasNextPage,
    };
  }
}
