import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { findBuyRecordsBySender } from '@/node/dao/buyV2.dao';
import { GetBuyInfoDto } from '@/node/dto/buyV2.dto';

@Controller()
export class BuyV2RecordController {
  @Get('buy-node-record')
  async getBuyRecords(@Query() params: GetBuyInfoDto) {
    const { sender, pageSize = 25, nextCursor } = params;

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
