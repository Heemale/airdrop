import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { nodeClientV2 } from '@/sdk';
import { formatChange } from '@/node/formatter/formatChange';
import { handleChange } from '@/node/handler/handlerChange';
import { sleep } from '@/utils/time';

@Injectable()
export class NodeChangeScheduler {
  cursor: EventId | null = null;
  finished: boolean = false;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (!this.finished) {
      try {
        const logs = await nodeClientV2.changeNode({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleChange(formatChange(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`NodeChangeScheduler subscribe v2 error => ${message}`);
      }
      await sleep(1);
    }
  }
}
