import { BuySummary } from '@local/airdrop-sdk/node';
import { add, convertSmallToLarge, subtract, toFixed } from '@/utils/math';
import { suiClient } from '@/sdk';
import { Prisma } from '@prisma/client';

export interface PaymentDetails {
  paymentAddress?: string; // 用户支付地址
  paymentAmount?: bigint; // 用户支付金额
  inviterAddress?: string; // 邀请人地址
  inviterGains?: bigint; // 邀请人收益
  nodeReceiverAddress?: string; // 平台收益地址
  nodeReceiverGains?: bigint; // 平台收益金额
}

export const formatBuy = async (
  eventObject: BuySummary,
): Promise<Prisma.BuyRecordCreateInput & PaymentDetails> => {
  const { sender, rank, eventId, nodeNum, timestampMs } = eventObject;

  const digest = eventId.txDigest;
  const response = await suiClient.getTransactionBlock({
    digest,
    options: {
      showEffects: true,
      showBalanceChanges: true,
    },
  });
  const { storageCost, computationCost, storageRebate } =
    response.effects.gasUsed;
  const gasAmount = subtract(add(storageCost, computationCost), storageRebate);

  const parsedChanges = response.balanceChanges
    .filter((item) => item.coinType === '0x2::sui::SUI')
    .map((item) => {
      const owner = item.owner as {
        AddressOwner: string;
      };
      return {
        owner,
        coinType: item.coinType,
        amount: BigInt(item.amount),
      };
    });

  if (parsedChanges.length !== 3) {
    console.log('FormatBind balanceChanges 数组长度必须为 3');
    return {
      txDigest: eventId.txDigest,
      eventSeq: eventId.eventSeq,
      sender: sender.toLowerCase(),
      node: {
        connect: {
          rank, // 使用嵌套写入方式连接 Node 记录
        },
      },      nodeNum,
      timestamp: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
      paymentAddress: null,
      paymentAmount: null,
      inviterAddress: null,
      inviterGains: null,
      nodeReceiverAddress: null,
      nodeReceiverGains: null,
    };
  }
  const senderChange = parsedChanges.find((change) => change.amount < 0n);
  const receiverChanges = parsedChanges.filter((change) => change.amount > 0n);

  if (receiverChanges.length === 1) {
    const platformChange = receiverChanges[0];
    console.log('FormatBind 邀请人和根用户是同一个地址.');
    return {
      txDigest: eventId.txDigest,
      eventSeq: eventId.eventSeq,
      sender: sender.toLowerCase(),
      node: {
        connect: {
          rank, // 使用嵌套写入方式连接 Node 记录
        },
      },      nodeNum,
      timestamp: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
      paymentAddress: senderChange.owner.AddressOwner.toLowerCase(),
      paymentAmount: BigInt(
        subtract((-senderChange.amount).toString(), gasAmount),
      ),
      inviterAddress: null,
      inviterGains: null,
      nodeReceiverAddress: platformChange.owner.AddressOwner.toLowerCase(),
      nodeReceiverGains: BigInt(platformChange.amount),
    };
  }

  if (!senderChange || receiverChanges.length !== 2) {
    console.log('FormatBind 数据格式不符合预期');
    return {
      txDigest: eventId.txDigest,
      eventSeq: eventId.eventSeq,
      sender: sender.toLowerCase(),
      node: {
        connect: {
          rank, // 使用嵌套写入方式连接 Node 记录
        },
      },    
        nodeNum,
      timestamp: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
      paymentAddress: null,
      paymentAmount: null,
      inviterAddress: null,
      inviterGains: null,
      nodeReceiverAddress: null,
      nodeReceiverGains: null,
    };
  }
  const [platformChange, inviterChange] = receiverChanges.sort(
    (a, b) => (a.amount > b.amount ? -1 : 1), // 降序排序
  );

  return {
    txDigest: eventId.txDigest,
    eventSeq: eventId.eventSeq,
    sender: sender.toLowerCase(),
    node: {
      connect: {
        rank, // 使用嵌套写入方式连接 Node 记录
      },
    },       nodeNum,
    timestamp: BigInt(toFixed(convertSmallToLarge(timestampMs, 3), 0)),
    paymentAddress: senderChange.owner.AddressOwner.toLowerCase(),
    paymentAmount: BigInt(
      subtract((-senderChange.amount).toString(), gasAmount),
    ),
    inviterAddress: inviterChange.owner.AddressOwner.toLowerCase(),
    inviterGains: BigInt(inviterChange.amount),
    nodeReceiverAddress: platformChange.owner.AddressOwner.toLowerCase(),
    nodeReceiverGains: BigInt(platformChange.amount),
  };
};
