import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BindScheduler } from '@/user/scheduler/bind.scheduler ';
import { BuyScheduler } from '@/user/scheduler/buy.scheduler';
import { ClaimScheduler } from '@/user/scheduler/claim.scheduler';

@Module({
  controllers: [UserController],
  providers: [UserService, BindScheduler, BuyScheduler, ClaimScheduler],
})
export class UserModule {}
