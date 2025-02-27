import { Controller, Get, HttpException } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';
import { findAllAirdrops } from '@/airdrop/dao/airdrop.dao';

@Controller('airdrops')
export class AirdropController extends CrudController {
  protected resource: string = 'airdrop';

  @Get('all-airdrops')
  async getAllAirdrops() {
    try {
      return await findAllAirdrops();
    } catch ({ message }) {
      console.log(`GetAllNodes error: ${message}`);
      throw new HttpException('Error retrieving all nodes.', 500);
    }
  }
}
