import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { MODULE_CLOB } from './utils/constants';
import { bcs } from '@mysten/sui/bcs';

import type {
  DevInspectResults,
  PaginationArguments,
  PaginatedEvents,
  OrderArguments,
} from '@mysten/sui/client';
import { toHexString } from '../utils';
import { Summary } from '../types';
import { BindSummary } from './types';

export class InviteClient {
  constructor(
    public suiClient: SuiClient,
    public packageId: string,
  ) {}

  bind(invite: string, inviter: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::bind`,
      arguments: [tx.object(invite), tx.pure.address(inviter)],
    });
    return tx;
  }

  bindV2(invite: string, inviter: string, global: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::bind_v2`,
      arguments: [
        tx.object(invite),
        tx.pure.address(inviter),
        tx.object(global),
      ],
    });
    return tx;
  }
  async inviters(invite: string, user: string): Promise<string> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::inviters`,
      arguments: [tx.object(invite), tx.pure.address(user)],
    });
    // @ts-ignore
    const res: DevInspectResults =
      await this.suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: normalizeSuiAddress('0x0'),
      });
    // @ts-ignore
    const value = res?.results[0]?.returnValues[0][0];
    return '0x' + toHexString(value);
  }

  async root(invite: string): Promise<string> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::root`,
      arguments: [tx.object(invite)],
    });
    // @ts-ignore
    const res: DevInspectResults =
      await this.suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: normalizeSuiAddress('0x0'),
      });
    // @ts-ignore
    const value = res?.results[0]?.returnValues[0][0];
    return '0x' + toHexString(value);
  }

  async inviterFee(invite: string) {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::inviter_fee`,
      arguments: [tx.object(invite)],
    });
    // @ts-ignore
    const res: DevInspectResults =
      await this.suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: normalizeSuiAddress('0x0'),
      });
    // @ts-ignore
    const result = bcs.U64.parse(
      // @ts-ignore
      new Uint8Array(res?.results[0]?.returnValues[0][0]),
    );

    // 将返回的 BigInt 转换为 number
    return Number(result);
  }

  async getAllBind(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<BindSummary>> {
    const resp = await this.queryEvents('Bind', input);
    const customMapping = (rawEvent: any) => ({
      sender: rawEvent.sender as string,
      inviter: rawEvent.inviter as string,
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
