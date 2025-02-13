import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { MODULE_CLOB } from './utils/constants';
import type {
  PaginationArguments,
  PaginatedEvents,
  OrderArguments,
} from '@mysten/sui/client';
import { Summary } from '../types';
import { UpdateInitializationSummary } from './types';

export class GlobalClient {
  constructor(
    public suiClient: SuiClient,
    public packageId: string,
  ) {}

  new(): Transaction {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::new`,
      arguments: [],
    });
    return tx;
  }

  async modify(
    global: string,
    object: string,
    is_valid: boolean,
  ): Promise<Transaction> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::update_initialization_list`,
      arguments: [
        tx.object(global),
        tx.pure.id(object),
        tx.pure.bool(is_valid),
      ],
    });

    return tx;
  }

  async updateInitialization(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<UpdateInitializationSummary>> {
    const resp = await this.queryEvents('UpdateInitializationList', input);
    const customMapping = (rawEvent: any) => ({
      object: rawEvent.object as bigint,
      ivValid: rawEvent.is_valid as boolean,
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
