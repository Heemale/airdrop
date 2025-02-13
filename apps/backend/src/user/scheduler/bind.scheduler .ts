import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { inviteClient, inviteClientV1, inviteClientV2 } from '@/sdk';
import { formatBind } from '@/user/formatter/formatBind';
import { handleBind } from '@/user/handler/handleBind';
import { sleep } from '@/utils/time';

@Injectable()
export class BindScheduler {
  cursor: EventId | null = null;
  cursorV1: EventId | null = null;
  cursorV2: EventId | null = null;
  finished: boolean = false;
  finishedV1: boolean = false;
  finishedV2: boolean = false;

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
        if (logs.hasNextPage) {
          this.cursorV1 = logs.nextCursor;
        } else {
          this.finishedV1 = true;
        }
      } catch ({ message }) {
        console.error(`BindScheduler subscribe v1 error => ${message}`);
      }
      await sleep(1);
    }
    while (!this.finishedV2) {
      try {
        const logs = await inviteClientV2.getAllBind({
          cursor: this.cursorV2,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleBind(formatBind(log));
        }
        if (logs.hasNextPage) {
          this.cursorV2 = logs.nextCursor;
        } else {
          this.finishedV2 = true;
        }
      } catch ({ message }) {
        console.error(`BindScheduler subscribe v2 error => ${message}`);
      }
      await sleep(1);
    }
    while (!this.finished) {
      try {
        const logs = await inviteClient.getAllBind({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleBind(formatBind(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`BindScheduler subscribe v3 error => ${message}`);
      }
      await sleep(1);
    }
  }
}
