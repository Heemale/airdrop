import { Module } from '@nestjs/common';
import { GlobalController } from '@/global/global.controller';

@Module({
  controllers: [GlobalController],
  providers: [],
})
export class GlobalModule {}
