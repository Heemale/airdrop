import { Module } from '@nestjs/common';
import { NodeController } from '@/node/node.controller';
import { BuyScheduler } from '@/node/scheduler/buy.scheduler';
import { NodeChangeScheduler } from '@/node/scheduler/nodeChange.scheduler';

@Module({
  controllers: [NodeController],
  providers: [BuyScheduler, NodeChangeScheduler],
})
export class NodeModule {}
