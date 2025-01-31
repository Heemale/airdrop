import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { findUserByAddress, getAllSubordinates } from '@/user/dao/user.dao';
import { GetSharesDto, GetUserInfoDto } from '@/user/dto/getUserInfo.dto';

@Controller('user')
export class UserController {
  @Get()
  async getUserInfo(@Query() params: GetUserInfoDto) {
    if (!params.address) {
      throw new HttpException('Invalid parameters', 400);
    }
    const user = await findUserByAddress(params.address);
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
    const { sender, pageSize = 25, nextCursor } = params;

    if (!sender) {
      throw new HttpException('Invalid parameters', 400);
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
      nextCursor ? ids.indexOf(Number(nextCursor)) + 1 : 0,
      0,
    );
    const paginatedIds = ids.slice(startIndex, startIndex + Number(pageSize));

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

    const hasNextPage = data.length === Number(pageSize);
    const cursor = hasNextPage ? data[data.length - 1].id : null;

    return {
      data,
      nextCursor: cursor,
      hasNextPage,
    };
  }
}
