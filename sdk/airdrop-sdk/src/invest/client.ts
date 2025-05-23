import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { normalizeSuiAddress } from '@mysten/sui/utils';
import { MODULE_CLOB } from './utils/constants';
import type {
  DevInspectResults,
  PaginationArguments,
  PaginatedEvents,
  OrderArguments,
} from '@mysten/sui/client';
import { Summary } from '../types';
import { UpdateGainsSummary, UpdateInvestSummary } from './types';

export class InvestClient {
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
    invest: string,
    user: string,
    fix_total_investment: bigint,
    fix_total_gains: bigint,
    fix_last_investment: bigint,
    fix_accumulated_gains: bigint,
  ): Promise<boolean> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${this.packageId}::${MODULE_CLOB}::modify`,
      arguments: [
        tx.object(invest),
        tx.pure.address(user),
        tx.pure.u64(fix_total_investment),
        tx.pure.u64(fix_total_gains),
        tx.pure.u64(fix_last_investment),
        tx.pure.u64(fix_accumulated_gains),
      ],
    });

    // @ts-ignore
    const res: DevInspectResults =
      await this.suiClient.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: normalizeSuiAddress('0x0'),
      });

    // @ts-ignore
    const value = res?.results[0]?.returnValues[0][0];

    // 强制转换为布尔值并返回
    return !!value; // 或者直接使用 Boolean(value)
  }

  async getAllUpdateInvest(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<UpdateInvestSummary>> {
    const resp = await this.queryEvents('UpdateInvest', input);
    const customMapping = (rawEvent: any) => ({
      address: rawEvent.address as string,
      amount: rawEvent.amount as bigint,
      isIncrease: rawEvent.is_increase as boolean,
      totalInvestment: rawEvent.total_investment as bigint,
    });
    return this.handleEventReturns(resp, customMapping);
  }

  async getAllUpdateGains(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<UpdateGainsSummary>> {
    const resp = await this.queryEvents('UpdateGains', input);
    const customMapping = (rawEvent: any) => ({
      address: rawEvent.address as string,
      amount: rawEvent.amount as bigint,
      isIncrease: rawEvent.is_increase as boolean,
      totalGains: rawEvent.total_gains as bigint,
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
