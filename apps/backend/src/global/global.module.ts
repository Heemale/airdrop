import { Module } from '@nestjs/common';
import { ObjectController } from '@/global/object.controller';

@Module({
  controllers: [ObjectController],
  providers: [],
})
export class GlobalModule {}
