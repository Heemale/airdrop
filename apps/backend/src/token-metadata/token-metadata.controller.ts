import { Controller } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';

@Controller('token-metadatas')
export class TokenMetadataController extends CrudController {
  protected resource: string = 'tokenMetadata';
}
