import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { investClientV2 } from '@/sdk';
import { formatUpdateInvest } from '@/invest/formatter/formatUpdateInvest';
import { handleUpdateInvest } from '@/invest/handler/handleUpdateInvest';
import { sleep } from '@/utils/time';
import { consoleError } from '@/log';

@Injectable()
export class UpdateInvestScheduler {
	cursorV2: EventId | null = null;
	finishedV2: boolean = false;

	@Cron(new Date(Date.now() + 5 * 1000))
	async task() {
		await this.subscribe();
	}

	async subscribe() {
		while (!this.finishedV2) {
			try {
				const logs = await investClientV2.getAllUpdateInvest({
					cursor: this.cursorV2,
					order: 'ascending',
				});
				for (const log of logs.data) {
					await handleUpdateInvest(formatUpdateInvest(log));
				}
				if (logs.hasNextPage) this.cursorV2 = logs.nextCursor;
			} catch ({ message }) {
				consoleError(this.constructor.name, message);
			}
			await sleep(1);
		}
	}
}
