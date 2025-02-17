import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { nodeClient, nodeClientV1, nodeClientV2 } from '@/sdk'; // 确保引入正确的客户端
import { formatChange } from '@/node/formatter/formatChange';
import { handleChange } from '@/node/handler/handlerChange';
import { sleep } from '@/utils/time';

@Injectable()
export class NodeChangeScheduler {
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
    // 监听 V1
    while (!this.finishedV1) {
      try {
        const logs = await nodeClientV1.changeNode({
          cursor: this.cursorV1,
          order: 'ascending',
        });
        console.log('v1',logs)
        for (const log of logs.data) {
          await handleChange(formatChange(log));
        }
        if (logs.hasNextPage) {
          this.cursorV1 = logs.nextCursor;
        } else {
          this.finishedV1 = true;
        }
      } catch ({ message }) {
        console.error(`NodeChangeScheduler subscribe v1 error => ${message}`);
      }
      await sleep(1);
    }

    // 监听 V2
    while (!this.finishedV2) {
      try {
        const logs = await nodeClientV2.changeNode({
          cursor: this.cursorV2,
          order: 'ascending',
        });
        console.log('v2',logs)

        for (const log of logs.data) {
          await handleChange(formatChange(log));
        }
        if (logs.hasNextPage) {
          this.cursorV2 = logs.nextCursor;
        } else {
          this.finishedV2 = true;
        }
      } catch ({ message }) {
        console.error(`NodeChangeScheduler subscribe v2 error => ${message}`);
      }
      await sleep(1);
    }

    // 监听主版本
    while (!this.finished) {
      try {
        const logs = await nodeClient.changeNode({
          cursor: this.cursor,
          order: 'ascending',
        });
        console.log('v',logs)

        for (const log of logs.data) {
          await handleChange(formatChange(log));
        }
        if (logs.hasNextPage) {
          this.cursor = logs.nextCursor;
        } else {
          this.finished = true;
        }
      } catch ({ message }) {
        console.error(`NodeChangeScheduler subscribe error => ${message}`);
      }
      await sleep(1);
    }
  }
}