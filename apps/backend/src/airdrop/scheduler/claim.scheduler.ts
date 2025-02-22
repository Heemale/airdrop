import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EventId } from '@mysten/sui/client';
import { airdropClientV1 } from '@/sdk';
import { formatClaim } from '@/airdrop/formatter/formatClaim';
import { handleClaim } from '@/airdrop/handler/handleClaim';
import { sleep } from '@/utils/time';
import { consoleError } from '@/log';

@Injectable()
export class ClaimScheduler {
	cursorV1: EventId | null = null;
	finishedV1: boolean = false;

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
				if (logs.hasNextPage) this.cursorV1 = logs.nextCursor;
			} catch ({ message }) {
				consoleError(this.constructor.name, message);
			}
			await sleep(1);
		}
	}
}
