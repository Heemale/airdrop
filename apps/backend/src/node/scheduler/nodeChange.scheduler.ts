import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { nodeClientV2 } from '@/sdk';
import { formatChange } from '@/node/formatter/formatChange';
import { handleChange } from '@/node/handler/handlerChange';
import { sleep } from '@/utils/time';
import { consoleError } from '@/log';

@Injectable()
export class NodeChangeScheduler {
  cursorV2: EventId | null = null;
  finishedV2: boolean = false;

  @Cron(new Date(Date.now()))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (!this.finishedV2) {
      try {
        const logs = await nodeClientV2.changeNode({
          cursor: this.cursorV2,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleChange(formatChange(log));
        }
        if (logs.hasNextPage) this.cursorV2 = logs.nextCursor;
      } catch ({ message }) {
        consoleError(this.constructor.name, message);
      }
      await sleep(1);
    }
  }
}
