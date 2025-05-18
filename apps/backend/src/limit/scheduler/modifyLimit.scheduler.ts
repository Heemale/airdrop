import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { limitClientV2 } from '@/sdk';
import { formatModifyLimit } from '@/limit/formatter/formatModifyLimit';
import { handlerModifyLimit } from '@/limit/handler/handlerModifyLimit';
import { sleep } from '@/utils/time';
import { consoleError } from '@/log';

@Injectable()
export class ModifyLimitScheduler {
  cursorV2: EventId | null = null;
  finishedV2: boolean = false;

  @Cron(new Date(Date.now()))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (!this.finishedV2) {
      try {
        const logs = await limitClientV2.modifyLimit({
          cursor: this.cursorV2,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handlerModifyLimit(formatModifyLimit(log));
        }
        if (logs.hasNextPage) this.cursorV2 = logs.nextCursor;
      } catch ({ message }) {
        consoleError(this.constructor.name, message);
      }
      await sleep(1);
    }
  }
}
