import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AirdropController } from '../airdrop/airdrop.controller';
import { BindScheduler } from '@/user/scheduler/bind.scheduler ';
import { ClaimScheduler } from '@/airdrop/scheduler/claim.scheduler';

@Module({
  controllers: [UserController, AirdropController],
  providers: [BindScheduler, ClaimScheduler],
})
export class UserModule {}
