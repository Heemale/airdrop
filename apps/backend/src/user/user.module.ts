import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AirdropController } from './airdrop.controller';
import { BindScheduler } from '@/user/scheduler/bind.scheduler ';
import { ClaimScheduler } from '@/user/scheduler/claim.scheduler';
import { TransferScheduler } from '@/user/scheduler/transfer.scheduler';

@Module({
  controllers: [UserController, AirdropController],
  providers: [BindScheduler, ClaimScheduler, TransferScheduler],
})
export class UserModule {}
