import { Module } from '@nestjs/common';
import { ObjectController } from '@/global/object.controller';
import { UpdateInitializationListScheduler } from './scheduler/updateInitializationList.scheduler';

@Module({
  controllers: [ObjectController],
  providers: [UpdateInitializationListScheduler],
})
export class GlobalModule {}
