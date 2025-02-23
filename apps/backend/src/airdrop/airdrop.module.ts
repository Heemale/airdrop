import { Module } from '@nestjs/common';
import { AirdropController } from './airdrop.controller';
import { ClaimScheduler } from '@/airdrop/scheduler/claim.scheduler';
import { ClaimRecordController } from '@/airdrop/claim-record.controller';

@Module({
  controllers: [AirdropController, ClaimRecordController],
  providers: [ClaimScheduler],
})
export class AirdropModule {}
