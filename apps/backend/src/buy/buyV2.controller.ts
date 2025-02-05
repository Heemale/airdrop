import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { BuyService } from './buyV2.service';
import { findBuyRecordsBySender } from '@/buy/dao/buyV2.dao';
import { GetBuyInfoDto } from '@/buy/dto/buyV2.dto';

@Controller('buy-node-record')
export class BuyV2RecordController {
  constructor(private readonly buyService: BuyService) {}

  @Get()
  async getBuyRecords(@Query() params: GetBuyInfoDto) {
    const { sender, pageSize = 5, nextCursor } = params;

    // 参数校验
    if (!sender) {
      throw new HttpException('Sender address is required', 400);
    }
    if (nextCursor && isNaN(Number(nextCursor))) {
      throw new HttpException('Invalid nextCursor.', 400);
    }
    if (
      isNaN(Number(pageSize)) ||
      Number(pageSize) <= 0 ||
      Number(pageSize) > 200
    ) {
      throw new HttpException('Page size must be between 1 and 200', 400);
    }

    try {
      // 查询购买记录
      return await findBuyRecordsBySender(
        sender,
        nextCursor && Number(nextCursor),
        Number(pageSize),
      );

      // 查询记录总数
    } catch ({ message }) {
      console.log(`FindClaimRecords error: ${message}`);
      throw new HttpException('Error retrieving claim records.', 500);
    }
  }
}
