import { Controller } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';

@Controller('media-configs')
export class MediaConfigController extends CrudController {
  protected resource = 'mediaConfig';
}
