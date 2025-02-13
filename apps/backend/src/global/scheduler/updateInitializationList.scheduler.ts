import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { globalClientV2 } from '@/sdk';
import { formatUpdateInitializationList } from '@/global/formatter/formatUpdateInitializationList';
import { handlerUpdateInitializationList } from '@/global/handler/handlerUpdateInitializationList';
import { sleep } from '@/utils/time';

@Injectable()
export class UpdateInitializationListScheduler {
  cursor: EventId | null = null;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (true) {
      try {
        const logs = await globalClientV2.updateInitialization({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handlerUpdateInitializationList(
            formatUpdateInitializationList(log),
          );
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
