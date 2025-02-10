import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BuyModule } from './node/buyV2.module';
import { AirdropModule } from './airdrop/airdrop.module';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule, BuyModule, AirdropModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
