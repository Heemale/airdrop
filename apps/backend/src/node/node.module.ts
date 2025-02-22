import { Module } from '@nestjs/common';
import { NodeController } from '@/node/node.controller';
import { BuyScheduler } from '@/node/scheduler/buy.scheduler';
import { NodeChangeScheduler } from '@/node/scheduler/nodeChange.scheduler';
import { BuyRecordController } from '@/node/buyRecord.controller';

@Module({
  controllers: [NodeController],
  providers: [BuyScheduler, NodeChangeScheduler, BuyRecordController],
})
export class NodeModule {}
