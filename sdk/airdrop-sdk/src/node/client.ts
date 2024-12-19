import type {
  OrderArguments,
  PaginatedEvents,
  PaginationArguments,
} from '@mysten/sui/client';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { PACKAGE_ID } from '../utils/constants';
import { MODULE_CLOB } from './utils/constants';
import { NodeInfo } from './types';
import { bcs } from '@mysten/sui/bcs';

export class NodeClient {
  constructor(public suiClient: SuiClient) {}

  async buy(
    T: string,
    nodes: string,
    invite: string,
    rank: number,
    wallet: string | null,
    amount: bigint | null,
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
      if (T === '0x2::sui::SUI' && amount) {
        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);
        tx.moveCall({
          typeArguments: [T],
          target: `${PACKAGE_ID}::${MODULE_CLOB}::buy`,
          arguments: [
            tx.object(nodes),
            tx.object(invite),
            tx.pure.u8(rank),
            coin,
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
          target: `${PACKAGE_ID}::${MODULE_CLOB}::buy`,
          arguments: [
            tx.object(nodes),
            tx.object(invite),
            tx.pure.u8(rank),
            coin,
          ],
        });
      }
    }
    return tx;
  }

  async transfer(nodes: string, receiver: string): Promise<Transaction> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::transfer`,
      arguments: [tx.object(nodes), tx.pure.address(receiver)],
    });
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

    const decoder = new TextDecoder('utf-8');

    const customMapping = (rawEvent: any): NodeInfo => ({
      rank: rawEvent.rank as number,
      name: decoder.decode(new Uint8Array(rawEvent.name)),
      description: decoder.decode(new Uint8Array(rawEvent.description)),
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

  async isAlreadyBuyNode(nodes: string, sender: string): Promise<boolean> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::is_already_buy_node`,
      arguments: [tx.object(nodes), tx.pure.address(sender)],
    });
    // @ts-ignore
    const res: DevInspectResults =
      await this.suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: normalizeSuiAddress('0x0'),
      });
    // @ts-ignore
    const value = res?.results[0]?.returnValues[0][0];
    return value[0] !== 0;
  }

  async remainingQuantityOfClaim(nodes: string, sender: string, round: bigint) {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::remaining_quantity_of_claim`,
      arguments: [
        tx.object(nodes),
        tx.pure.address(sender),
        tx.pure.u64(round),
      ],
    });
    // @ts-ignore
    const res: DevInspectResults =
      await this.suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: normalizeSuiAddress('0x0'),
      });
    // @ts-ignore
    return bcs.U64.parse(new Uint8Array(res?.results[0]?.returnValues[0][0]));
  }

  async receiver(nodes: string): Promise<string> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::receiver`,
      arguments: [tx.object(nodes)],
    });
    // @ts-ignore
    const res: DevInspectResults =
      await this.suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: normalizeSuiAddress('0x0'),
      });
    // @ts-ignore
    return bcs.Address.parse(
      new Uint8Array(res?.results[0]?.returnValues[0][0]),
    );
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
