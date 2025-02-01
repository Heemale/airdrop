import { Module } from '@nestjs/common';
import { BuyService } from './buyV2.service';
import { BuyV2RecordController } from './buyV2.controller';
import { BuyScheduler } from '@/buy/scheduler/buy.scheduler';
import { BuyV2Scheduler } from '@/buy/scheduler/buyV2.scheduler';
@Module({
  controllers: [BuyV2RecordController],
  providers: [BuyService, BuyScheduler, BuyV2Scheduler],
})
export class BuyModule {}
