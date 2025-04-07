import { Module } from '@nestjs/common';
import { TokenMetadataController } from './token-metadata.controller';

@Module({
  controllers: [TokenMetadataController],
  providers: [],
})
export class TokenMetadataModule {}
