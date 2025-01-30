import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { findClaimRecords } from '@/user/dao/claimRecord.dao';
import { GetClaimInfoDto } from '@/user/dto/getClaimInfo.dto';
import { AirdropService } from './airdrop.service';

@Controller()
export class ClaimController {
  constructor(private readonly claimService: AirdropService) {}

  @Get('claim-airdrop-record')
  async getClaimRecords(@Query() params: GetClaimInfoDto) {
    const { sender, page = 1, pageSize = 25, currentCursor } = params;

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
      const result = await findClaimRecords(
        sender.toLowerCase(),
        currentCursor,
        Number(pageSize),
      );

      return {
        address: sender,
        nextCursor: result.nextCursor,
        data: result.data,
      };
    } catch ({ message }) {
      console.log({ message: message });
      throw new HttpException('Error retrieving claim information', 500);
    }
  }
}
