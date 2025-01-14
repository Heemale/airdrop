import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { inviteClient } from '@/sdk';
import { formatBind } from '@/user/formatter/formatBind';
import { handleBind } from '@/user/handler/handleBind';
import { sleep } from '@/utils/time';

@Injectable()
export class BindScheduler {
  cursor: EventId | null = null;

  @Cron(new Date(Date.now() + 5 * 1000))
  async task() {
    await this.subscribe();
  }

  async subscribe() {
    while (true) {
      try {
        const logs = await inviteClient.getAllBind({
          cursor: this.cursor,
          order: 'ascending',
        });
        for (const log of logs.data) {
          await handleBind(formatBind(log));
        }
        if (logs.hasNextPage) this.cursor = logs.nextCursor;
      } catch ({ message }) {
        console.error(`BetBearScheduler getAllBetBearTask error => ${message}`);
      }
      await sleep(1);
    }
  }
}
