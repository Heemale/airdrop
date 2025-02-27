import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';
import { getMediasByPage } from '@/media-config/dao/media-config.dao';
import { handleBigInt } from '@/common/crud/handler';

@Controller('media-configs')
export class MediaConfigController extends CrudController {
  protected resource = 'mediaConfig';

  @Get('pages/:page')
  async getMediasByPage(@Param('page') page: string) {
    if (!page) {
      throw new HttpException('Invalid parameters', HttpStatus.BAD_REQUEST);
    }
    const data = await getMediasByPage(page);
    const record = data.reduce((acc, curr) => {
      acc[curr.code] = curr;
      return acc;
    }, {});
    return handleBigInt(record);
  }
}
