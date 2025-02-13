import { Module } from '@nestjs/common';
import { BuyV2RecordController } from './buyV2.controller';
import { BuyScheduler } from '@/node/scheduler/buy.scheduler';
import { BuyV2Scheduler } from '@/node/scheduler/buyV2.scheduler';

@Module({
  controllers: [BuyV2RecordController],
  providers: [BuyScheduler, BuyV2Scheduler],
})
export class BuyModule {}
