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
import { Summary } from '../types';
import { UpdateInvestSummary } from './types';

export class InvestClient{
  constructor(public suiClient: SuiClient) {}

  async modify(invest: string, user: string): Promise<boolean> {
    const tx = new Transaction();
    tx.moveCall({
      typeArguments: [],
      target: `${PACKAGE_ID}::${MODULE_CLOB}::modify`,
      arguments: [tx.object(invest), tx.pure.address(user)],
    });
    
    // @ts-ignore
    const res: DevInspectResults = await this.suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: normalizeSuiAddress('0x0'),
    });
    
    // @ts-ignore
    const value = res?.results[0]?.returnValues[0][0];
  
    // 强制转换为布尔值并返回
    return !!value; // 或者直接使用 Boolean(value)
  }
  

    async updateInvest(
        input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
      ): Promise<Summary<UpdateInvestSummary>> {
        const resp = await this.queryEvents('UpdateInvest', input);
        const customMapping = (rawEvent: any) => ({
          address: rawEvent.address as string,
          amount: rawEvent.amount as bigint,
          isIncrese:rawEvent.is_increse as boolean,
          totalInvestment: rawEvent.total_investment as bigint,
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