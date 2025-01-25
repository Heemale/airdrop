import { Body, Controller, Get, HttpException, Post, Query } from '@nestjs/common';
import {
  getAndUpdateAirdropAmount,
  updateClaimRecord,
} from '@/user/dao/claimRecord.dao';
import { GetClaimInfoDto, UpdateClaimDto } from '@/user/dto/getClaimInfo.dto';
import { AirdropService } from './airdrop.service'; // 引入服务方法

@Controller('claim')
export class ClaimController {
  constructor(private readonly claimService: AirdropService) {}
  // 查询用户的空投总收益
  @Get('info')
  async getClaimInfo(@Query() params: GetClaimInfoDto) {
    if (!params.address) {
      throw new HttpException('Invalid parameters: address is required', 400);
    }

    try {
      // 调用服务来获取空投信息并更新
      const result = await getAndUpdateAirdropAmount(params.address);
      
      if (!result.success) {
        throw new HttpException(result.message, 500);
      }

      // 返回查询结果
      return {
        address: params.address,
        totalAirdropAmount: result.totalAirdropAmount.toString(),  // 返回计算后的总收益
      };
    } catch (error) {
      throw new HttpException('Error retrieving claim information', 500);
    }
  }

  // 更新用户的空投领取记录
  // 更新用户的空投领取记录
@Post('update')
async updateClaim(@Body() params: UpdateClaimDto) {
  if (!params.address || !params.amount || !params.txDigest || !params.eventSeq) {
    throw new HttpException('Invalid parameters: address, amount, txDigest, and eventSeq are required', 400);
  }

  try {
    // 更新空投记录
    const updatedRecord = await updateClaimRecord(
      params.address,
      params.amount,
      params.txDigest,   // 事务摘要
      params.eventSeq    // 事件序列号
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
