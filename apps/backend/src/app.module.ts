import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UserModule } from '@/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AirdropModule } from '@/airdrop/airdrop.module';
import { GlobalModule } from '@/global/global.module';
import { LimitModule } from '@/limit/limit.module';
import { InvestModule } from '@/invest/invest.module';
import { NodeModule } from '@/node/node.module';
import { UploadModule } from '@/upload/upload.module';
import { AuthModule } from '@/auth/auth.module';
import { MediaConfigModule } from '@/media-config/media-config.module';
import { TokenMetadataModule } from './token-metadata/token-metadata.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    NodeModule,
    UserModule,
    AirdropModule,
    GlobalModule,
    LimitModule,
    InvestModule,
    UploadModule,
    AuthModule,
    MediaConfigModule,
    TokenMetadataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
