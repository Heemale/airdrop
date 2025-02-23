import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';
import { getBuyRecordsBySender } from '@/node/dao/node.dao';
import { PaginatedRequest } from '@/common/types';

@Controller('buy-records')
export class BuyRecordController extends CrudController {
  protected resource: string = 'buyRecord';

  @Get('address/:address')
  async getBuyRecords(
    @Param('address') address: string,
    @Query() params: PaginatedRequest,
  ) {
    const sender = address && address.toLowerCase();
    const { pageSize = 25, nextCursor } = params;

    if (!sender) {
      throw new HttpException(
        'Sender address is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (nextCursor && isNaN(Number(nextCursor))) {
      throw new HttpException('Invalid nextCursor.', HttpStatus.BAD_REQUEST);
    }
    if (
      isNaN(Number(pageSize)) ||
      Number(pageSize) <= 0 ||
      Number(pageSize) > 200
    ) {
      throw new HttpException(
        'Page size must be between 1 and 200',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await getBuyRecordsBySender(
        sender,
        nextCursor && Number(nextCursor),
        Number(pageSize),
      );
    } catch ({ message }) {
      console.log(`FindClaimRecords error: ${message}`);
      throw new HttpException(
        'Error retrieving claim records.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
