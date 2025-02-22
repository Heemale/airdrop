import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { BindScheduler } from '@/user/scheduler/bind.scheduler ';
import { ClaimScheduler } from '@/airdrop/scheduler/claim.scheduler';

@Module({
	controllers: [UserController],
	providers: [BindScheduler, ClaimScheduler],
})
export class UserModule {}
