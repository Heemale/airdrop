import { Module } from '@nestjs/common';
import { BuyService } from './buyV2.service';
import { BuyV2RecordController } from './buyV2.controller';
import { BuyScheduler } from '@/buy/scheduler/buy.scheduler';

@Module({
  controllers: [BuyV2RecordController],
  providers: [BuyService, BuyScheduler],
})
export class BuyModule {}
