import { Controller } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';

@Controller('objects')
export class ObjectController extends CrudController {
  protected resource: string = 'object';
}
