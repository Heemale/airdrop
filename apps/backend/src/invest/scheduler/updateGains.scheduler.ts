import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { investClientV2 } from '@/sdk';
import { formatUpdateGains } from '@/invest/formatter/formatUpdateGains';
import { handleUpdateGains } from '@/invest/handler/handleUpdateGains';
import { sleep } from '@/utils/time';

@Injectable()
export class UpdateGainsScheduler {
  cursor: EventId | null = null;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (true) {
      try {
        const logs = await investClientV2.getAllUpdateGains({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleUpdateGains(formatUpdateGains(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`UpdateGainsScheduler subscribe error => ${message}`);
      }
      await sleep(1);
    }
  }
}
