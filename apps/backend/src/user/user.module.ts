import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BindScheduler } from '@/user/scheduler/bind.scheduler';

@Module({
  controllers: [UserController],
  providers: [UserService, BindScheduler],
})
export class UserModule {}
