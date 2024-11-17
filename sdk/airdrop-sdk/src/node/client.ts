import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { PACKAGE_ID } from '../utils/constants';
import { MODULE_CLOB } from './utils/constants';
import type {
  PaginationArguments,
  PaginatedEvents,
  OrderArguments,
} from '@mysten/sui/client';
import { NodeInfo } from './types';

export class NodeClient {
  constructor(public suiClient: SuiClient) {}

  async buy(
    T: string,
    nodes: string,
    invite: string,
    rank: number,
    wallet: string | undefined,
    owner: string,
  ): Promise<Transaction> {
    const tx = new Transaction();
    if (wallet) {
      tx.moveCall({
        typeArguments: [T],
        target: `${PACKAGE_ID}::${MODULE_CLOB}::buy`,
        arguments: [
          tx.object(nodes),
          tx.object(invite),
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
        arguments: [tx.object(nodes), tx.object(invite), tx.pure.u64(rank), coin],
      });
    }
    return tx;
  }

  async nodeList(nodes: string): Promise<Array<NodeInfo>> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::node_list`,
      arguments: [tx.object(nodes)],
    });
    // @ts-ignore
    const res: DevInspectResults =
      await this.suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: normalizeSuiAddress('0x0'),
      });
    // @ts-ignore
    const events: Array<SuiEvent> = res?.events;

    const customMapping = (rawEvent: any): NodeInfo => ({
      rank: rawEvent.rank as number,
      name: rawEvent.name as string,
      description: rawEvent.description as string,
      limit: rawEvent.limit as bigint,
      price: rawEvent.price as bigint,
      total_quantity: rawEvent.total_quantity as bigint,
      purchased_quantity: rawEvent.purchased_quantity as bigint,
    });

    return events.map((event) => {
      // @ts-ignore
      return customMapping(event?.parsedJson);
    });
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
