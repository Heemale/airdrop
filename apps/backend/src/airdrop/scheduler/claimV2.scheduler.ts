import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { airdropClientV2 } from '@/sdk';
import { formatClaim } from '@/airdrop/formatter/formatClaim';
import { handleClaim } from '@/airdrop/handler/handleClaim';
import { sleep } from '@/utils/time';

@Injectable()
export class ClaimV2Scheduler {
  cursor: EventId | null = null;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (true) {
      try {
        const logs = await airdropClientV2.getAllClaim({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleClaim(formatClaim(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`ClaimV2Scheduler subscribe error => ${message}`);
      }
      await sleep(1);
    }
  }
}
