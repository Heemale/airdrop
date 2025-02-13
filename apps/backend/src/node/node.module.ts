import { Module } from '@nestjs/common';
import { NodeController } from '@/node/node.controller';
import { BuyScheduler } from '@/node/scheduler/buy.scheduler';

@Module({
  controllers: [NodeController],
  providers: [BuyScheduler],
})
export class NodeModule {}
