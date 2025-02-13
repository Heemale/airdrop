import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { nodeClientV2 } from '@/sdk';
import { formatBuyV2 } from '@/node/formatter/formatBuyV2';
import { handleBuyV2 } from '@/node/handler/handleBuyV2';
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
        const logs = await nodeClientV2.getAllBuyV2({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleBuyV2(formatBuyV2(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`BuyV2Scheduler subscribe error => ${message}`);
      }
      await sleep(1);
    }
  }
}
