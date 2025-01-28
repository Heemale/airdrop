import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import {AirdropService}from './airdrop.service';
import { ClaimController}from './airdrop.controller';
import { BindScheduler } from '@/user/scheduler/bind.scheduler ';
import { ClaimScheduler } from '@/user/scheduler/claim.scheduler';
@Module({
  controllers: [UserController,ClaimController],
  providers: [UserService, BindScheduler, ClaimScheduler,AirdropService],
})
export class UserModule {}
