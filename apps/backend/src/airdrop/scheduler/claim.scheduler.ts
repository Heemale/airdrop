import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { airdropClient, airdropClientV1, airdropClientV2 } from '@/sdk';
import { formatClaim } from '@/airdrop/formatter/formatClaim';
import { handleClaim } from '@/airdrop/handler/handleClaim';
import { sleep } from '@/utils/time';

@Injectable()
export class ClaimScheduler {
  cursor: EventId | null = null;
  cursorV1: EventId | null = null;
  cursorV2: EventId | null = null;
  finished: boolean = false;
  finishedV1: boolean = false;
  finishedV2: boolean = false;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (!this.finishedV1) {
      try {
        const logs = await airdropClientV1.getAllClaim({
          cursor: this.cursorV1,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleClaim(formatClaim(log));
        }
        if (logs.hasNextPage) {
          this.cursorV1 = logs.nextCursor;
        } else {
          this.finishedV1 = true;
        }
      } catch ({ message }) {
        console.error(`ClaimScheduler subscribe v1 error => ${message}`);
      }
      await sleep(1);
    }
    while (!this.finishedV2) {
      try {
        const logs = await airdropClientV2.getAllClaim({
          cursor: this.cursorV2,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleClaim(formatClaim(log));
        }
        if (logs.hasNextPage) {
          this.cursorV2 = logs.nextCursor;
        } else {
          this.finishedV2 = true;
        }
      } catch ({ message }) {
        console.error(`ClaimScheduler subscribe v2 error => ${message}`);
      }
      await sleep(1);
    }
    while (!this.finished) {
      try {
        const logs = await airdropClient.getAllClaim({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleClaim(formatClaim(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`ClaimScheduler subscribe v3 error => ${message}`);
      }
      await sleep(1);
    }
  }
}
