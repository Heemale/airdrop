import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { inviteClientV1 } from '@/sdk';
import { formatBind } from '@/user/formatter/formatBind';
import { handleBind } from '@/user/handler/handleBind';
import { sleep } from '@/utils/time';

@Injectable()
export class BindScheduler {
  cursorV1: EventId | null = null;
  finishedV1: boolean = false;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (!this.finishedV1) {
      try {
        const logs = await inviteClientV1.getAllBind({
          cursor: this.cursorV1,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleBind(formatBind(log));
        }
        if (logs.hasNextPage) this.cursorV1 = logs.nextCursor;
      } catch ({ message }) {
        console.error(`${this.constructor.name} subscribe error => ${message}`);
      }
      await sleep(1);
    }
  }
}
