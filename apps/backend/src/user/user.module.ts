import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AirdropService } from './airdrop.service';
import { ClaimController } from './airdrop.controller';
import { BindScheduler } from '@/user/scheduler/bind.scheduler ';
import { ClaimScheduler } from '@/user/scheduler/claim.scheduler';
import { BuyScheduler } from '@/user/scheduler/buy.scheduler';
import { TransferScheduler } from '@/user/scheduler/transfer.scheduler';

@Module({
  controllers: [UserController, ClaimController],
  providers: [
    UserService,
    AirdropService,
    BindScheduler,
    ClaimScheduler,
    BuyScheduler,
    TransferScheduler,
  ],
})
export class UserModule {}
