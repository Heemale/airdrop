import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { BindScheduler } from '@/user/scheduler/bind.scheduler';

@Module({
  controllers: [UserController],
  providers: [BindScheduler],
})
export class UserModule {}
