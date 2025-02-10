import { Module } from '@nestjs/common';
import { AirdropController } from './airdrop.controller';
import { ClaimScheduler } from '@/airdrop/scheduler/claim.scheduler';
import { ChangeScheduler } from '@/airdrop/scheduler/change.scheduler';

@Module({
  controllers: [AirdropController],
  providers: [ClaimScheduler, ChangeScheduler],
})
export class AirdropModule {}
