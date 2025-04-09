import { Controller, Get, HttpException } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';
import { findAllNodes } from './dao/node.dao';

@Controller('nodes')
export class NodeController extends CrudController {
  protected resource: string = 'node';

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
