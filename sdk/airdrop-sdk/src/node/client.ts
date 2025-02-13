import type {
  OrderArguments,
  PaginatedEvents,
  PaginationArguments,
} from '@mysten/sui/client';
import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { MODULE_CLOB } from './utils/constants';
import { NodeInfo, AddSummary } from './types';
import { bcs } from '@mysten/sui/bcs';
import { Summary } from '../types';
import { BuySummary } from './types';
import { BuyV2Summary } from './types';
import { NodeChangeSummary } from './types';

export class NodeClient {
  constructor(
    public suiClient: SuiClient,
    public packageId: string,
  ) {}

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
        target: `${this.packageId}::${MODULE_CLOB}::buy`,
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
          target: `${this.packageId}::${MODULE_CLOB}::buy`,
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
          target: `${this.packageId}::${MODULE_CLOB}::buy`,
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

  async buy_v2(
    T: string,
    nodes: string,
    invite: string,
    rank: number,
    wallet: string | null,
    amount: bigint | null,
    owner: string,
    invest: string,
    global: string,
  ): Promise<Transaction> {
    const tx = new Transaction();
    if (wallet) {
      tx.moveCall({
        typeArguments: [T],
        target: `${this.packageId}::${MODULE_CLOB}::buy_v2`,
        arguments: [
          tx.object(nodes),
          tx.object(invite),
          tx.pure.u8(Number(rank)),
          tx.object(wallet),
          tx.object(invest),
          tx.object(global),
        ],
      });
    } else {
      if (T === '0x2::sui::SUI' && amount) {
        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);
        tx.moveCall({
          typeArguments: [T],
          target: `${this.packageId}::${MODULE_CLOB}::buy_v2`,
          arguments: [
            tx.object(nodes),
            tx.object(invite),
            tx.pure.u8(rank),
            coin,
            tx.object(invest),
            tx.object(global),
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
          target: `${this.packageId}::${MODULE_CLOB}::buy_v2`,
          arguments: [
            tx.object(nodes),
            tx.object(invite),
            tx.pure.u8(rank),
            coin,
            tx.object(invest),
            tx.object(global),
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
      target: `${this.packageId}::${MODULE_CLOB}::transfer`,
      arguments: [tx.object(nodes), tx.pure.address(receiver)],
    });
    return tx;
  }

  async nodeList(nodes: string): Promise<Array<NodeInfo>> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::node_list`,
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
      isOpen: rawEvent.is_open as boolean,
    });

    return events.map((event) => {
      // @ts-ignore
      return customMapping(event?.parsedJson);
    });
  }
  async getNodeStatus(nodes: string, sender: string): Promise<bigint> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::user_node_status`,
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

    // 返回 u64 类型的节点状态值
    return value;
  }

  async isAlreadyBuyNode(nodes: string, sender: string): Promise<boolean> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::is_already_buy_node`,
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
      target: `${this.packageId}::${MODULE_CLOB}::remaining_quantity_of_claim`,
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
      target: `${this.packageId}::${MODULE_CLOB}::receiver`,
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

  async getAllBuy(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<BuySummary>> {
    const resp = await this.queryEvents('Buy', input);
    const customMapping = (rawEvent: any) => ({
      sender: rawEvent.sender as string,
      rank: rawEvent.rank as bigint,
      nodeNum: rawEvent.node_num as bigint,
    });
    return this.handleEventReturns(resp, customMapping);
  }

  async getAllBuyV2(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<BuyV2Summary>> {
    const resp = await this.queryEvents('BuyV2', input);
    const customMapping = (rawEvent: any) => ({
      sender: rawEvent.sender as string,
      rank: rawEvent.rank as bigint,
      timestamp: rawEvent.timestamp as bigint,
      nodeNum: rawEvent.node_num as bigint,
      paymentAmount: rawEvent.payment_amount as bigint,
      inviterGains: rawEvent.inviter_gains as bigint,
      nodeReceiverGains: rawEvent.node_receiver_gains as bigint,
    });
    return this.handleEventReturns(resp, customMapping);
  }

  async addNode(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<AddSummary>> {
    const resp = await this.queryEvents('', input);
    const customMapping = (rawEvent: any) => ({
      rank: rawEvent.rank as bigint,
      createAt: rawEvent.create_at as bigint,
      name: rawEvent.name as string,
      description: rawEvent.description as bigint,
      isOpen: rawEvent.node_receiver_gains as boolean,
    });
    return this.handleEventReturns(resp, customMapping);
  }

  async changeNode(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<NodeChangeSummary>> {
    const resp = await this.queryEvents('NodeChange', input);
    const customMapping = (rawEvent: any) => ({
      rank: rawEvent.rank as bigint,
      name: rawEvent.name as string,
      limit: rawEvent.limit as bigint,
      price: rawEvent.price as bigint,
      totalQuantity: rawEvent.total_quantity as bigint,
      description: rawEvent.description as bigint,
      purchasedQuantity: rawEvent.purchased_quantity as bigint,
      isOpen: rawEvent.node_receiver_gains as boolean,
      isRemove: rawEvent.is_remove as boolean,
    });
    return this.handleEventReturns(resp, customMapping);
  }
  async queryEvents(
    eventName: string,
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ) {
    // @ts-ignore
    return this.suiClient.queryEvents({
      query: {
        MoveEventType: `${this.packageId}::${MODULE_CLOB}::${eventName}`,
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
