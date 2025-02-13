import { Module } from '@nestjs/common';
import { UpdateInitializationListScheduler } from '@/global/scheduler/updateInitializationList.scheduler';

@Module({
  controllers: [],
  providers: [UpdateInitializationListScheduler],
})
export class GlobalModule {}
