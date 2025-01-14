import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  directSubordinates,
  findUserByAddress,
  getAllSubordinates,
} from '@/user/dao/user.dao';
import { GetSharesDto, GetUserInfoDto } from '@/user/dto/getUserInfo.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
      shares: data.directSubordinates.length,
      teams: data.allSubordinates.length,
    };
  }

  @Post('shares')
  async getShares(@Body() params: GetSharesDto) {
    return directSubordinates(params.ids);
  }
}
