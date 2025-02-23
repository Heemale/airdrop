import { Module } from '@nestjs/common';
import { LimitController } from '@/limit/limit.controller';

@Module({
  controllers: [LimitController],
  providers: [],
})
export class LimitModule {}
