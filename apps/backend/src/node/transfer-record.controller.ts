import { Controller } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';

@Controller('transfer-records')
export class TransferRecordController extends CrudController {
  protected resource: string = 'transferRecord';
}
