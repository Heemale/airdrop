import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { nodeClient } from '@/sdk';
import { formatBuyV2 } from '@/user/formatter/formatBuyV2';
import { handleBuyV2 } from '@/user/handler/handleBuyV2';
import { sleep } from '@/utils/time';

@Injectable()
export class BuyV2Scheduler {
  cursor: EventId | null = null;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (true) {
      try {
        const logs = await nodeClient.getV2AllBuy({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleBuyV2(formatBuyV2(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`BetBearScheduler getAllBetBearTask error => ${message}`);
      }
      await sleep(1);
    }
  }
}
