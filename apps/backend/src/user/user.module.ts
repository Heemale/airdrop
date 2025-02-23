import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { BindScheduler } from '@/user/scheduler/bind.scheduler ';
import { ClaimScheduler } from '@/airdrop/scheduler/claim.scheduler';
import { User2Controller } from '@/user/user2.controller';

@Module({
  controllers: [UserController, User2Controller],
  providers: [BindScheduler, ClaimScheduler],
})
export class UserModule {}
