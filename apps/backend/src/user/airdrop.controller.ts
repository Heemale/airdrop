import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import {
  getAndUpdateAirdropAmountWithCursor,
  updateClaimRecord,
} from '@/user/dao/claimRecord.dao';
import { GetClaimInfoDto, UpdateClaimDto } from '@/user/dto/getClaimInfo.dto';
import { AirdropService } from './airdrop.service'; // 引入服务方法

@Controller('claim-airdrop-record')
export class ClaimController {
  constructor(private readonly claimService: AirdropService) {}
  // 查询用户的空投总收益
  @Get('info')
  async getClaimInfo(@Body() params: GetClaimInfoDto) {
    const { sender, page = 1, pageSize = 25 ,currentCursor} = params;

    if (!sender) {
      throw new HttpException('Invalid parameters: address is required', 400);
    }
    if (isNaN(Number(page)) || Number(page) <= 0) {
      throw new HttpException('Invalid page number', 400);
    }
    if (
      isNaN(Number(pageSize)) ||
      Number(pageSize) <= 0 ||
      Number(pageSize) > 200
    ) {
      throw new HttpException('Page size must be between 1 and 200', 400);
    }

    try {
      console.log(222222,currentCursor)
      // 调用服务来获取空投信息并更新
      const result = await getAndUpdateAirdropAmountWithCursor(
        sender.toLowerCase(),
        currentCursor,
        Number(pageSize),
      );
console.log(1111111,result.claimRecords)
      if (!result.success) {
        throw new HttpException(result.message, 500);
      }

      // 返回查询结果
      return {
        address: sender,
        nextCursor: result.nextCursor, // 返回下一页游标
        claimRecords: result.claimRecords, // 返回完整的 claimRecords 数组
      };
    } catch (error) {
      throw new HttpException('Error retrieving claim information', 500);
    }
  }

  // 更新用户的空投领取记录
  // 更新用户的空投领取记录
  @Post('update')
  async updateClaim(@Body() params: UpdateClaimDto) {
    if (
      !params.address ||
      !params.amount ||
      !params.txDigest ||
      !params.eventSeq
    ) {
      throw new HttpException(
        'Invalid parameters: address, amount, txDigest, and eventSeq are required',
        400,
      );
    }

    try {
      // 更新空投记录
      const updatedRecord = await updateClaimRecord(
        params.address.toLowerCase() ,
        params.amount,
        params.txDigest, // 事务摘要
        params.eventSeq, // 事件序列号
      );

      return {
        success: true,
        message: 'Claim record updated successfully',
        updatedRecord,
      };
    } catch (error) {
      throw new HttpException('Error updating claim record', 500);
    }
  }
}
