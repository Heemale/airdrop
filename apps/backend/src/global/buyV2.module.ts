import { Module } from '@nestjs/common';
import { BuyService } from './buyV2.service';
import { BuyV2RecordController } from './buyV2.controller';
import { BuyScheduler } from '@/node/scheduler/buy.scheduler';
import { ChangeV2Scheduler } from '@/node/scheduler/Change.scheduler';
@Module({
  controllers: [BuyV2RecordController],
  providers: [BuyService, BuyScheduler, ChangeV2Scheduler],
})
export class BuyModule {}
