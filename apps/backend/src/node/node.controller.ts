import { Controller } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';

@Controller('nodes')
export class NodeController extends CrudController {
  protected resource: string = 'node';
}
