import { Module } from '@nestjs/common';
import { AirdropController } from './airdrop.controller';
import { ClaimScheduler } from '@/airdrop/scheduler/claim.scheduler';
import { ClaimRecordController } from '@/airdrop/claim-record.controller';
import { AirdropChangeScheduler } from '@/airdrop/scheduler/airdropChange.scheduler';

@Module({
  controllers: [AirdropController, ClaimRecordController],
  providers: [ClaimScheduler, AirdropChangeScheduler],
})
export class AirdropModule {}
