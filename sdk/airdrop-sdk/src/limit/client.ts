import { SuiClient } from '@mysten/sui/client';
import { MODULE_CLOB } from './utils/constants';
import type {
  PaginationArguments,
  PaginatedEvents,
  OrderArguments,
} from '@mysten/sui/client';
import { Summary } from '../types';
import { SpecialUserLimitSummary } from './types';

export class LimitClient {
  constructor(
    public suiClient: SuiClient,
    public packageId: string,
  ) {}
  async modifyLimit(
    input: PaginationArguments<PaginatedEvents['nextCursor']> & OrderArguments,
  ): Promise<Summary<SpecialUserLimitSummary>> {
    const resp = await this.queryEvents('ModifyLimit', input);
    const customMapping = (rawEvent: any) => ({
      times: rawEvent.times as string,
      isLimit: rawEvent.is_limit as boolean,
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
