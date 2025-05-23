import { Module } from '@nestjs/common';
import { NodeController } from '@/node/node.controller';
import { BuyScheduler } from '@/node/scheduler/buy.scheduler';
import { NodeChangeScheduler } from '@/node/scheduler/nodeChange.scheduler';
import { BuyRecordController } from '@/node/buy-record.controller';
import { TransferRecordController } from '@/node/transfer-record.controller';

@Module({
  controllers: [NodeController, BuyRecordController, TransferRecordController],
  providers: [BuyScheduler, NodeChangeScheduler],
})
export class NodeModule {}
