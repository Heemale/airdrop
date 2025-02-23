import { Controller } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';

@Controller('airdrops')
export class AirdropController extends CrudController {
  protected resource: string = 'airdrop';
}
