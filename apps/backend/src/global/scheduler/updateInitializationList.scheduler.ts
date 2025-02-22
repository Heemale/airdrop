import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { globalClientV2 } from '@/sdk';
import { formatUpdateInitializationList } from '@/global/formatter/formatUpdateInitializationList';
import { handlerUpdateInitializationList } from '@/global/handler/handlerUpdateInitializationList';
import { sleep } from '@/utils/time';
import { consoleError } from '@/log';

@Injectable()
export class UpdateInitializationListScheduler {
  cursorV2: EventId | null = null;
  finishedV2: boolean = false;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (!this.finishedV2) {
      try {
        const logs = await globalClientV2.updateInitialization({
          cursor: this.cursorV2,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handlerUpdateInitializationList(
            formatUpdateInitializationList(log),
          );
        }
        if (logs.hasNextPage) this.cursorV2 = logs.nextCursor;
      } catch ({ message }) {
        consoleError(this.constructor.name, message);
      }
      await sleep(1);
    }
  }
}
