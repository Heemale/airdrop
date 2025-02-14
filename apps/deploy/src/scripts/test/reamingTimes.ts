import { NODES, LIMITS } from '@/sdk/constants';
import { nodeClient } from '@/sdk';

const reamingTimes = async () => {
  const res = await nodeClient.remainingQuantityOfClaimV2(
    NODES,
    '0x2ff7e1caaab6dbe36bf791ca3ece7dea7371cc2480bda6337754024b322fa985',
    BigInt(7),
    LIMITS,
  );
  console.log({ res });
};

const main = async () => {
  await reamingTimes();
};

main().catch(({ message }) => {
  console.log({ message });
});
