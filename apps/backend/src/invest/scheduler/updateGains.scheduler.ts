import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { investClientV2, investClient } from '@/sdk';
import { formatUpdateGains } from '@/invest/formatter/formatUpdateGains';
import { handleUpdateGains } from '@/invest/handler/handleUpdateGains';
import { sleep } from '@/utils/time';

@Injectable()
export class UpdateGainsScheduler {
  cursor: EventId | null = null;
  cursorV2: EventId | null = null;
  finished: boolean = false;
  finishedV2: boolean = false;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (!this.finishedV2) {
      try {
        const logs = await investClientV2.getAllUpdateGains({
          cursor: this.cursorV2,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleUpdateGains(formatUpdateGains(log));
        }
        if (logs.hasNextPage) {
          this.cursorV2 = logs.nextCursor;
        } else {
          this.finishedV2 = true;
        }
      } catch ({ message }) {
        console.error(`UpdateGainsScheduler subscribe v2 error => ${message}`);
      }
      await sleep(1);
    }
    while (!this.finished) {
      try {
        const logs = await investClient.getAllUpdateGains({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleUpdateGains(formatUpdateGains(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`UpdateGainsScheduler subscribe v3 error => ${message}`);
      }
      await sleep(1);
    }
  }
}
