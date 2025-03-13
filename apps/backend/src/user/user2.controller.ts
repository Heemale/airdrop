import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  getAllSubordinates,
  getRootUsers,
  getUserId,
} from '@/user/dao/user.dao';

@Controller('user')
export class User2Controller {
  @Get('children')
  async getChildren() {
    const users = await getRootUsers();
    const children = await Promise.all(
      users.map(async (user) => {
        const data = await getAllSubordinates(user.id);
        return {
          parentAddress: user.address,
          children: data.children, // 返回包含树状结构的子节点
        };
      }),
    );

    // 提取所有根用户的地址
    const rootAddresses = users.map((user) => user.address);

    return {
      rootAddresses, // 返回根用户的地址数组
      children, // 返回每个根用户的子节点
    };
  }

  @Get('address/:address/children')
  async getChildren2(@Param('address') address: string) {
    const sender = address && address.toLowerCase();
    if (!sender) {
      throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
    }
    const user = await getUserId(sender);
    const data = await getAllSubordinates(user);

    return data.children;
  }
}
