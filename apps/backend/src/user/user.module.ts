import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { BindScheduler } from '@/user/scheduler/bind.scheduler ';
import { ClaimScheduler } from '@/airdrop/scheduler/claim.scheduler';
import { BindV2Scheduler } from '@/user/scheduler/bindV2.scheduler ';

@Module({
  controllers: [UserController],
  providers: [BindScheduler, BindV2Scheduler, ClaimScheduler],
})
export class UserModule {}
