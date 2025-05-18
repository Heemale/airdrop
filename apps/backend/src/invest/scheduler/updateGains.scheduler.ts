import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { investClientV2 } from '@/sdk';
import { formatUpdateGains } from '@/invest/formatter/formatUpdateGains';
import { handleUpdateGains } from '@/invest/handler/handleUpdateGains';
import { sleep } from '@/utils/time';
import { consoleError } from '@/log';

@Injectable()
export class UpdateGainsScheduler {
  cursorV2: EventId | null = null;
  finishedV2: boolean = false;

  @Cron(new Date(Date.now()))
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
        if (logs.hasNextPage) this.cursorV2 = logs.nextCursor;
      } catch ({ message }) {
        consoleError(this.constructor.name, message);
      }
      await sleep(1);
    }
  }
}
