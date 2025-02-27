import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { MODULE_CLOB } from './utils/constants';
import type {
  DevInspectResults,
  SuiEvent,
  PaginationArguments,
  PaginatedEvents,
  OrderArguments,
} from '@mysten/sui/client';
import { AirdropInfo } from './types';
import { Summary } from '../types';
import { ClaimSummary } from './types';
import { AirdropChangeSummary } from './types';

export class AirdropClient {
  constructor(
    public suiClient: SuiClient,
    public packageId: string,
  ) {}

  new(adminCap: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::new`,
      arguments: [tx.object(adminCap)],
    });
    return tx;
  }

  insert(
    tx: Transaction,
    T: string,
    adminCap: string,
    airdrops: string,
    startTime: bigint,
    endTime: bigint,
    totalShares: bigint,
    totalBalance: bigint,
    description: string,
    wallet: any,
    imageUrl: string,
  ) {
    tx.moveCall({
      typeArguments: [T],
      target: `${this.packageId}::${MODULE_CLOB}::insert`,
      arguments: [
        tx.object(adminCap),
        tx.object(airdrops),
        tx.pure.u64(startTime),
        tx.pure.u64(endTime),
        tx.pure.u64(totalShares),
        tx.pure.u64(totalBalance),
        tx.pure.string(description),
        wallet,
        tx.pure.string(imageUrl),
      ],
    });
  }

  modify(
    adminCap: string,
    airdrops: string,
    round: bigint,
    startTime: bigint,
    endTime: bigint,
    isOpen: boolean,
    description: string,
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::modify`,
      arguments: [
        tx.object(adminCap),
        tx.object(airdrops),
        tx.pure.u64(round),
        tx.pure.u64(startTime),
        tx.pure.u64(endTime),
        tx.pure.bool(isOpen),
        tx.pure.string(description),
      ],
    });
    return tx;
  }

  withdraw(
    T: string,
    adminCap: string,
    airdrops: string,
    round: bigint,
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [T],
      target: `${this.packageId}::${MODULE_CLOB}::withdraw`,
      arguments: [tx.object(adminCap), tx.object(airdrops), tx.pure.u64(round)],
    });
    return tx;
  }

  claim(
    T: string,
    adminCap: string,
    nodes: string,
    round: bigint,
    clock: string,
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [T],
      target: `${this.packageId}::${MODULE_CLOB}::claim`,
      arguments: [
        tx.object(adminCap),
        tx.object(nodes),
        tx.pure.u64(round),
        tx.object(clock),
      ],
    });
    return tx;
  }

  claimV2(
    T: string,
    adminCap: string,
    nodes: string,
    round: bigint,
    clock: string,
    limits: string,
    invest: string,
    global: string,
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [T],
      target: `${this.packageId}::${MODULE_CLOB}::claim_v2`,
      arguments: [
        tx.object(adminCap),
        tx.object(nodes),
        tx.pure.u64(round),
        tx.object(clock),
        tx.object(limits),
        tx.object(invest),
        tx.object(global),
      ],
    });
    return tx;
  }

  modifyLimits(
    adminCap: string,
    limits: string,
    address: string,
    times: bigint,
    is_limit: boolean,
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::modify_special_limits`,
      arguments: [
        tx.object(adminCap),
        tx.object(limits),
        tx.pure.address(address),
        tx.pure.u64(times),
        tx.pure.bool(is_limit),
      ],
    });
    return tx;
  }
  newInvite(adminCap: string, root: string, inviter_fee: bigint): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::new_invite`,
      arguments: [
        tx.object(adminCap),
        tx.pure.address(root),
        tx.pure.u64(inviter_fee),
      ],
    });
    return tx;
  }

  modifyInvite(
    adminCap: string,
    invite: string,
    root: string,
    inviter_fee: bigint,
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::modify_invite`,
      arguments: [
        tx.object(adminCap),
        tx.object(invite),
        tx.pure.address(root),
        tx.pure.u64(inviter_fee),
      ],
    });
    return tx;
  }

  newNode(T: string, adminCap: string, receiver: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [T],
      target: `${this.packageId}::${MODULE_CLOB}::new_node`,
      arguments: [tx.object(adminCap), tx.pure.address(receiver)],
    });
    return tx;
  }

  insertNode(
    tx: Transaction,
    adminCap: string,
    nodes: string,
    name: string,
    description: string,
    limit: bigint,
    price: bigint,
    total_quantity: bigint,
  ) {
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::insert_node`,
      arguments: [
        tx.object(adminCap),
        tx.object(nodes),
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.u64(limit),
        tx.pure.u64(price),
        tx.pure.u64(total_quantity),
      ],
    });
  }

  removeNode(adminCap: string, nodes: string, rank: number): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::remove_nodes`,
      arguments: [tx.object(adminCap), tx.object(nodes), tx.pure.u8(rank)],
    });
    return tx;
  }

  modifyNode(
    adminCap: string,
    nodes: string,
    rank: number,
    name: string,
    description: string,
    price: bigint,
    limit: bigint,
    totalQuantity: bigint,
    isOpen: boolean,
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::modify_node`,
      arguments: [
        tx.object(adminCap),
        tx.object(nodes),
        tx.pure.u8(rank),
        tx.pure.string(name),
        tx.pure.string(description),
        tx.pure.u64(price),
        tx.pure.u64(limit),
        tx.pure.u64(totalQuantity),
        tx.pure.bool(isOpen),
      ],
    });
    return tx;
  }

  modify_nodes(
    T: string,
    adminCap: string,
    nodes: string,
    receiver: string,
  ): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [T],
      target: `${this.packageId}::${MODULE_CLOB}::modify_nodes`,
      arguments: [
        tx.object(adminCap),
        tx.object(nodes),
        tx.pure.address(receiver),
      ],
    });
    return tx;
  }

  async airdrops(airdrops: string): Promise<Array<AirdropInfo>> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::airdrops`,
      arguments: [tx.object(airdrops)],
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

    const customMapping = (rawEvent: any): AirdropInfo => ({
      round: rawEvent.round as bigint,
      startTime: rawEvent.start_time as bigint,
      endTime: rawEvent.end_time as bigint,
      totalShares: rawEvent.total_shares as bigint,
      claimedShares: rawEvent.claimed_shares as bigint,
      totalBalance: rawEvent.total_balance as bigint,
      isOpen: rawEvent.is_open as boolean,
      description: decoder.decode(new Uint8Array(rawEvent.description)),
      image_url: decoder.decode(new Uint8Array(rawEvent.image_url)),
      coinType: rawEvent.coin_type.name as string,
      remaining_balance: rawEvent.remaining_balance as bigint,
    });

    return events.map((event) => {
      // @ts-ignore
      return customMapping(event?.parsedJson);
    });
  }

  async getAllClaim(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<ClaimSummary>> {
    const resp = await this.queryEvents('Claim', input);

    const customMapping = (rawEvent: any) => {
      return {
        sender: rawEvent.sender as string,
        round: rawEvent.round as bigint,
        coinType: ('0x' + rawEvent.coin_type.name) as string,
        amount: rawEvent.amount as bigint,
        timestamp: rawEvent.timestamp as bigint,
      };
    };
    return this.handleEventReturns(resp, customMapping);
  }
  async changeAirdrop(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<AirdropChangeSummary>> {
    const resp = await this.queryEvents('AirdropChange', input);

    const customMapping = (rawEvent: any) => {
      const decoder = new TextDecoder('utf-8');

      return {
        description: decoder.decode(new Uint8Array(rawEvent.description)),
        round: rawEvent.round as bigint,
        coinType: ('0x' + rawEvent.coin_type.name) as string,
        startTime: rawEvent.start_time as bigint,
        endTime: rawEvent.end_time as bigint,
        isOpen: rawEvent.is_open as boolean,
        totalShares: rawEvent.total_shares as bigint,
        claimedShares: rawEvent.claimed_shares as bigint,
        totalBalance: rawEvent.total_balance as bigint,
        imageUrl: decoder.decode(new Uint8Array(rawEvent.image_url)),
        remainingBalance: rawEvent.remaining_balance as bigint,
        isRemove: rawEvent.is_remove as boolean,
      };
    };
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
