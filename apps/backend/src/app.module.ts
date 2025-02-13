import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BuyModule } from './node/buyV2.module';
import { AirdropModule } from './airdrop/airdrop.module';
import { InvestModule } from './invest/invest.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    UserModule,
    BuyModule,
    AirdropModule,
    InvestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
