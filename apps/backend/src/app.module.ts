import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BuyModule } from './node/buyV2.module';
import { AirdropModule } from './airdrop/airdrop.module';
import { GlobalModule } from './global/global.module';
import { LimitModule } from './limit/limit.module';
import { InvestModule } from './invest/invest.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    UserModule,

    BuyModule,

    AirdropModule,
    GlobalModule,
    LimitModule,
    InvestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
