import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { airdropClientV1 } from '@/sdk';
import { formatAirdropChange } from '@/airdrop/formatter/formatAirdropChange';
import { handleAirdropChange } from '@/airdrop/handler/handleAirdropChange';
import { sleep } from '@/utils/time';

@Injectable()
export class AirdropChangeScheduler {
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
          await handleAirdropChange(formatAirdropChange(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`ClaimScheduler subscribe error => ${message}`);
      }
      await sleep(1);
    }
  }
}
