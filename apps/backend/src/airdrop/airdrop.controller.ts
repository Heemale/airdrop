import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { findClaimRecords } from '@/airdrop/dao/claimRecord.dao';
import { GetClaimRecordsDto } from '@/airdrop/dto/getClaimRecords.dto';

@Controller('claim-airdrop-record')
export class AirdropController {
	@Get()
	async getClaimRecords(@Query() params: GetClaimRecordsDto) {
		const { sender, pageSize = 25, nextCursor } = params;

		if (!sender) {
			throw new HttpException('Invalid parameters: sender is required.', 400);
		}

		if (nextCursor && isNaN(Number(nextCursor))) {
			throw new HttpException('Invalid nextCursor.', 400);
		}

		if (
			isNaN(Number(pageSize)) ||
			Number(pageSize) <= 0 ||
			Number(pageSize) > 200
		) {
			throw new HttpException('Page size must be between 1 and 200.', 400);
		}

		try {
			return await findClaimRecords(
				sender.toLowerCase(),
				nextCursor && Number(nextCursor),
				Number(pageSize),
			);
		} catch ({ message }) {
			console.log(`FindClaimRecords error: ${message}`);
			throw new HttpException('Error retrieving claim records.', 500);
		}
	}
}
