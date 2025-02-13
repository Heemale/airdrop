import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { limitV2 } from '@/sdk';
import { formatModifyLimit } from '@/limit/formatter/formatModifyLimit';
import { handlerModifyLimit } from '@/limit/handler/handlerModifyLimit';
import { sleep } from '@/utils/time';

@Injectable()
export class ModifyLimitScheduler {
  cursor: EventId | null = null;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (true) {
      try {
        const logs = await limitV2.modifyLimit({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handlerModifyLimit(formatModifyLimit(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(
          `UpdateInitializationListScheduler subscribe error => ${message}`,
        );
      }
      await sleep(1);
    }
  }
}
