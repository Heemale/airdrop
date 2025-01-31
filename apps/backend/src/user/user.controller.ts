import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { findUserByAddress, getAllSubordinates } from '@/user/dao/user.dao';
import { GetSharesDto, GetUserInfoDto } from '@/user/dto/getUserInfo.dto';

@Controller('user')
export class UserController {
  @Get('info')
  async getUserInfo(@Query() params: GetUserInfoDto) {
    const sender = params.sender && params.sender.toLowerCase();

    if (!sender) {
      throw new HttpException('Invalid parameters', 400);
    }

    const user = await findUserByAddress(sender);
    if (!user) {
      throw new HttpException('User not Found.', 400);
    }

    const data = await getAllSubordinates(user.id);
    return {
      address: user.address,
      inviter: user.inviter,
      totalInvestment: user.totalInvestment,
      totalGains: user.totalGains,
      teamTotalInvestment: Number(data.totalInvestmentSum),
      shares: data.directSubordinates.length,
      teams: data.allSubordinates.length,
    };
  }

  @Get('shares')
  async getShares(@Query() params: GetSharesDto) {
    const sender = params.sender && params.sender.toLowerCase();
    const nextCursor = params.nextCursor && Number(params.nextCursor);
    const pageSize = params.pageSize ? Number(params.pageSize) : 25;

    if (!sender) {
      throw new HttpException('Invalid sender.', 400);
    }
    if (nextCursor && isNaN(nextCursor)) {
      throw new HttpException('Invalid nextCursor.', 400);
    }
    if (isNaN(pageSize) || pageSize <= 0 || pageSize > 200) {
      throw new HttpException('Page size must be between 1 and 200.', 400);
    }

    const user = await findUserByAddress(sender);
    if (!user || !user.sharerIds) {
      return {
        data: [],
        nextCursor: null,
        hasNextPage: false,
      };
    }

    const ids = user.sharerIds
      .split(',')
      .map(Number)
      .filter((id) => !isNaN(id));
    const startIndex = Math.max(
      nextCursor ? ids.indexOf(nextCursor) + 1 : 0,
      0,
    );
    const paginatedIds = ids.slice(startIndex, startIndex + pageSize);

    const data = await Promise.all(
      paginatedIds.map(async (id) => {
        const data = await getAllSubordinates(id);
        return {
          id: data.id,
          address: data.address,
          teamTotalInvestment: Number(data.totalInvestmentSum),
          shares: data.directSubordinates.length,
          teams: data.allSubordinates.length,
        };
      }),
    );

    const hasNextPage = data.length === pageSize;
    const cursor = hasNextPage ? data[data.length - 1].id : null;

    return {
      data,
      nextCursor: cursor,
      hasNextPage,
    };
  }
}
