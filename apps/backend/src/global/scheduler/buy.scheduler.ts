import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { nodeClientV1 } from '@/sdk';
import { formatBuy } from '@/node/formatter/formatBuy';
import { handleBuy } from '@/node/handler/handleBuy';
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
        const logs = await nodeClientV1.getAllBuy({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleBuy(await formatBuy(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`BuyScheduler subscribe error => ${message}`);
      }
      await sleep(1);
    }
  }
}
