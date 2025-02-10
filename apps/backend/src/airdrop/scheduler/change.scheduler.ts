import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { airdropClientV1 } from '@/sdk';
import { formatChange } from '@/airdrop/formatter/formatChange';
import { handleChange } from '@/airdrop/handler/handlerChange';
import { sleep } from '@/utils/time';

@Injectable()
export class ChangeScheduler {
  cursor: EventId | null = null;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (true) {
      try {
        const logs = await airdropClientV1.changeAirdrop({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleChange(formatChange(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`ClaimScheduler subscribe error => ${message}`);
      }
      await sleep(1);
    }
  }
}
