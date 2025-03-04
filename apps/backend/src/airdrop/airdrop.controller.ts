import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { CrudController } from '@/common/crud/crud.controller';
import { findAllAirdrops } from '@/airdrop/dao/airdrop.dao';
import { PaginatedRequest } from '@/common/types';
import { findTokenMetadata } from '@/airdrop/dao/coinMeta.dao';
import { handleBigInt } from '@/common/crud/handler';

@Controller('airdrops')
export class AirdropController extends CrudController {
  protected resource: string = 'airdrop';

  @Get('all-airdrops')
  async getAllAirdrops(@Query() params: PaginatedRequest) {
    const { pageSize = 25, nextCursor } = params;
    if (nextCursor && isNaN(Number(nextCursor))) {
      throw new HttpException('Invalid nextCursor.', 400);
    }

    if (
      isNaN(Number(pageSize)) ||
      Number(pageSize) <= 0 ||
      Number(pageSize) > 200
    ) {
      throw new HttpException('Page size must be between 1 and 200.', 400);
    }
    try {
      const formatAirdrop = await findAllAirdrops(
        nextCursor && Number(nextCursor),
        Number(pageSize),
      );
      console.log('98777777', formatAirdrop);
      const coinTypes = Array.from(
        new Set(formatAirdrop.data.map((item) => item.coinType)),
      );
      console.log('coinTypes', coinTypes);
      const tokenMetadata = await findTokenMetadata(coinTypes);
      console.log('tokenMetadata', tokenMetadata);

      const tokenMetadataMap = new Map(
        tokenMetadata.map((token) => [token.coinType, token]),
      );
      console.log('tokenMetadataMap', tokenMetadataMap);

      const responseData = formatAirdrop.data.map((airdrop) => ({
        airdrop: {
          ...airdrop,
          token: tokenMetadataMap.get(airdrop.coinType) || null, // 关联 token 数据
        },
      }));
      console.log(121213, responseData);

      const result = {
        data: responseData,
        nextCursor: formatAirdrop.nextCursor,
        hasNextPage: formatAirdrop.hasNextPage,
      };
      console.log('result', result);

      return handleBigInt(result);
    } catch ({ message }) {
      console.log(`GetAllNodes error: ${message}`);
      throw new HttpException('Error retrieving all nodes.', 500);
    }
  }
}
