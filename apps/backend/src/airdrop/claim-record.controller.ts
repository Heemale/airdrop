import { Controller, Get, HttpException, Param, Query } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';
import { PaginatedRequest } from '@/common/types';
import { findClaimRecords } from '@/airdrop/dao/claimRecord.dao';

@Controller('claim-records')
export class ClaimRecordController extends CrudController {
  protected resource: string = 'claimRecord';

  @Get('address/:address')
  async getClaimRecords(
    @Param() address: string,
    @Query() params: PaginatedRequest,
  ) {
    const sender = address && address.toLowerCase();
    const { pageSize = 25, nextCursor } = params;

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
