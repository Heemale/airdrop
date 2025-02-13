import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { investClient, investClientV2 } from '@/sdk';
import { formatUpdateInvest } from '@/invest/formatter/formatUpdateInvest';
import { handleUpdateInvest } from '@/invest/handler/handleUpdateInvest';
import { sleep } from '@/utils/time';

@Injectable()
export class UpdateInvestScheduler {
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
        const logs = await investClientV2.getAllUpdateInvest({
          cursor: this.cursorV2,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleUpdateInvest(formatUpdateInvest(log));
        }
        if (logs.hasNextPage) {
          this.cursorV2 = logs.nextCursor;
        } else {
          this.finishedV2 = true;
        }
      } catch ({ message }) {
        console.error(`UpdateInvestScheduler subscribe v2 error => ${message}`);
      }
      await sleep(1);
    }
    while (!this.finished) {
      try {
        const logs = await investClient.getAllUpdateInvest({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleUpdateInvest(formatUpdateInvest(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`UpdateInvestScheduler subscribe v3 error => ${message}`);
      }
      await sleep(1);
    }
  }
}
