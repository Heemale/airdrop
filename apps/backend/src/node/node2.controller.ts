import { Controller, Get, HttpException } from '@nestjs/common';
import { findAllNodes } from '@/node/dao/node.dao';

@Controller()
export class Node2Controller {
  @Get('all-nodes')
  async getAllNodes() {
    try {
      return await findAllNodes();
    } catch ({ message }) {
      console.log(`GetAllNodes error: ${message}`);
      throw new HttpException('Error retrieving all nodes.', 500);
    }
  }
}
