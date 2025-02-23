import { Controller, Get } from '@nestjs/common';
import { getAllSubordinates, getRootUsers } from '@/user/dao/user.dao';

@Controller('user')
export class User2Controller {
  @Get('children')
  async getRchildren() {
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
}
