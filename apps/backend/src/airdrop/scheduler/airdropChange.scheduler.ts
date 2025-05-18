import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { airdropClientV2 } from '@/sdk';
import { formatAirdropChange } from '@/airdrop/formatter/formatAirdropChange';
import { handleAirdropChange } from '@/airdrop/handler/handleAirdropChange';
import { sleep } from '@/utils/time';
import { consoleError } from '@/log';

@Injectable()
export class AirdropChangeScheduler {
  cursorV2: EventId | null = null;
  finishedV2: boolean = false;

  @Cron(new Date(Date.now() + 30 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (!this.finishedV2) {
      try {
        const logs = await airdropClientV2.changeAirdrop({
          cursor: this.cursorV2,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleAirdropChange(formatAirdropChange(log));
        }
        if (logs.hasNextPage) this.cursorV2 = logs.nextCursor;
      } catch ({ message }) {
        consoleError(this.constructor.name, message);
      }
      await sleep(1);
    }
  }
}
