import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { nodeClientV1 } from '@/sdk';
import { formatTransfer } from '@/user/formatter/formatTransfer';
import { handleTransfer } from '@/user/handler/handleTransfer';
import { sleep } from '@/utils/time';

@Injectable()
export class TransferScheduler {
  cursor: EventId | null = null;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (true) {
      try {
        const logs = await nodeClientV1.getAllTransfer({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleTransfer(formatTransfer(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`TransferScheduler subscribe error => ${message}`);
      }
      await sleep(1);
    }
  }
}
