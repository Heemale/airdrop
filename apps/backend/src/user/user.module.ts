import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BindScheduler } from '@/user/scheduler/bind.scheduler ';
import { ClaimScheduler } from '@/user/scheduler/claim.scheduler';
import { BuyScheduler } from '@/user/scheduler/buy.scheduler';
import { BuyV2Scheduler } from '@/user/scheduler/buyV2.scheduler';
@Module({
  controllers: [UserController],
  providers: [UserService, BindScheduler,  ClaimScheduler,BuyScheduler,BuyV2Scheduler],
})
export class UserModule {}
