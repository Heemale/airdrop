import { Module } from '@nestjs/common';
import { AirdropController } from './airdrop.controller';
import { ClaimScheduler } from '@/airdrop/scheduler/claim.scheduler';

@Module({
  controllers: [AirdropController],
  providers: [ClaimScheduler],
})
export class AirdropModule {}
