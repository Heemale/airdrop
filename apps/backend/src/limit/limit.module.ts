import { Module } from '@nestjs/common';
import { LimitController } from '@/limit/limit.controller';
import { ModifyLimitScheduler } from '@/limit/scheduler/modifyLimit.scheduler';
@Module({
  controllers: [LimitController],
  providers: [ModifyLimitScheduler],
})
export class LimitModule {}
