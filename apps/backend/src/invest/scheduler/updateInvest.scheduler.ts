import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { investClientV2 } from '@/sdk';
import { formatUpdateInvest } from '@/invest/formatter/formatUpdateInvest';
import { handleUpdateInvest } from '@/invest/handler/handleUpdateInvest';
import { sleep } from '@/utils/time';

@Injectable()
export class UpdateInvestScheduler {
  cursor: EventId | null = null;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (true) {
      try {
        const logs = await investClientV2.getAllUpdateInvest({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleUpdateInvest(formatUpdateInvest(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`UpdateInvestScheduler subscribe error => ${message}`);
      }
      await sleep(1);
    }
  }
}
