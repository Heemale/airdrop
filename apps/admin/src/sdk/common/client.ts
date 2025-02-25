import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';

export class CommonClient {
  constructor(public suiClient: SuiClient) {}

  async preparePaymentCoin(
    tx: Transaction,
    coinType: string,
    amount: bigint,
    owner: string,
  ) {
    if (coinType === '0x2::sui::SUI') {
      const [payCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(amount)]);
      return payCoin;
    }

    const { data: coins } = await this.suiClient.getCoins({
      owner,
      coinType,
    });
    if (!coins.length) {
      throw new Error(`No ${coinType} coins found for owner ${owner}`);
    }

    const [firstCoin, ...restCoins] = coins;
    if (restCoins.length > 0) {
      tx.mergeCoins(
        tx.object(firstCoin.coinObjectId),
        restCoins.map((coin) => tx.object(coin.coinObjectId)),
      );
    }

    const [payCoin] = tx.splitCoins(tx.object(firstCoin.coinObjectId), [
      tx.pure.u64(amount),
    ]);

    return payCoin;
  }
}
