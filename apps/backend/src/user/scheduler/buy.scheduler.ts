import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { nodeClient } from '@/sdk';
import { formatBuy } from '@/user/formatter/formatBuy';
import { handleBuy } from '@/user/handler/handleBuy';
import { sleep } from '@/utils/time';

@Injectable()
export class BuyScheduler {
  cursor: EventId | null = null;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (true) {
      try {
        const logs = await nodeClient.getAllBuy({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleBuy(formatBuy(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`BetBearScheduler getAllBetBearTask error => ${message}`);
      }
      await sleep(1);
    }
  }
}
