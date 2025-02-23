import { Module } from '@nestjs/common';
import { MediaConfigController } from './media-config.controller';

@Module({
  controllers: [MediaConfigController],
  providers: [],
})
export class MediaConfigModule {}
