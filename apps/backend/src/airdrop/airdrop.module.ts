import { Module } from '@nestjs/common';
import { AirdropController } from './airdrop.controller';
import { ClaimScheduler } from '@/airdrop/scheduler/claim.scheduler';
import { ClaimV2Scheduler } from '@/airdrop/scheduler/claimV2.scheduler';

@Module({
  controllers: [AirdropController],
  providers: [ClaimScheduler, ClaimV2Scheduler],
})
export class AirdropModule {}
