import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';
import { findAllAirdrops } from '@/airdrop/dao/airdrop.dao';
import { PaginatedRequest } from '@/common/types';

@Controller('airdrops')
export class AirdropController extends CrudController {
  protected resource: string = 'airdrop';

  @Get('all-airdrops')
  async getAllAirdrops(@Query() params: PaginatedRequest) {
    const { pageSize = 25, nextCursor } = params;
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
      return await findAllAirdrops(
        nextCursor && Number(nextCursor),
        Number(pageSize),
      );
    } catch ({ message }) {
      console.log(`GetAllNodes error: ${message}`);
      throw new HttpException('Error retrieving all nodes.', 500);
    }
  }
}
