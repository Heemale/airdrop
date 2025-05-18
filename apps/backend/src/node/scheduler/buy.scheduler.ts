import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { nodeClientV1, nodeClientV2 } from '@/sdk';
import { formatBuy } from '@/node/formatter/formatBuy';
import { handleBuy } from '@/node/handler/handleBuy';
import { sleep } from '@/utils/time';
import { handleBuyV2 } from '@/node/handler/handleBuyV2';
import { formatBuyV2 } from '@/node/formatter/formatBuyV2';
import { consoleError } from '@/log';

@Injectable()
export class BuyScheduler {
  cursorV1: EventId | null = null;
  cursorV2: EventId | null = null;
  finishedV1: boolean = false;
  finishedV2: boolean = false;

  @Cron(new Date(Date.now() + 30 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (!this.finishedV1) {
      try {
        const logs = await nodeClientV1.getAllBuy({
          cursor: this.cursorV1,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleBuy(await formatBuy(log));
        }
        if (logs.hasNextPage) {
          this.cursorV1 = logs.nextCursor;
        } else {
          this.finishedV1 = true;
        }
      } catch ({ message }) {
        consoleError(this.constructor.name, message);
      }
      await sleep(1);
    }
    while (!this.finishedV2) {
      try {
        const logs = await nodeClientV2.getAllBuyV2({
          cursor: this.cursorV2,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleBuyV2(formatBuyV2(log));
        }
        if (logs.hasNextPage) this.cursorV2 = logs.nextCursor;
      } catch ({ message }) {
        consoleError(this.constructor.name, message);
      }
      await sleep(1);
    }
  }
}
