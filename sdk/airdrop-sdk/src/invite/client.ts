import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { PACKAGE_ID } from '../utils/constants';
import { MODULE_CLOB } from './utils/constants';
import type {
  DevInspectResults,
  PaginationArguments,
  PaginatedEvents,
  OrderArguments,
} from '@mysten/sui/client';
import { toHexString } from '../utils';

export class InviteClient {
  constructor(public suiClient: SuiClient) {}

  bind(invite: string, inviter: string): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::bind`,
      arguments: [tx.object(invite), tx.pure.address(inviter)],
    });
    return tx;
  }

  async inviters(invite: string, user: string): Promise<string> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::inviters`,
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
      target: `${PACKAGE_ID}::${MODULE_CLOB}::root`,
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
      target: `${PACKAGE_ID}::${MODULE_CLOB}::inviter_fee`,
      arguments: [tx.object(invite)],
    });
    // @ts-ignore
    const res: DevInspectResults =
      await this.suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: normalizeSuiAddress('0x0'),
      });
    // @ts-ignore
    return res?.results[0]?.returnValues[0][0];
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
