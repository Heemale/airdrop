import { Controller } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';

@Controller('special-limits')
export class LimitController extends CrudController {
  protected resource: string = 'specialLimit';
}
