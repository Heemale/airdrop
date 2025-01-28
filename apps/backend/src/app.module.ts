import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BuyModule } from './buy/buyV2.module';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule, BuyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
