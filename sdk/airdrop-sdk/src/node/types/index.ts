import { TransactionSummary } from '../../types';
import { EventId } from '@mysten/sui/client';

export interface NodeInfo {
  // 等级
  rank: number;
  // 名称
  name: string;
  // 描述
  description: string;
  // 每轮空投购买次数
  limit: bigint;
  // 价格
  price: bigint;
  // 总量
  total_quantity: bigint;
  // 已购买的数量
  purchased_quantity: bigint;
  // 是否开启
  isOpen: boolean;
}

export interface BuySummary extends TransactionSummary {
  sender: string;
  rank: bigint;
  nodeNum: bigint;
}

export interface TransferSummary extends TransactionSummary {
  sender: string;
  receiver: string;
  rank: bigint;
  nodeNum: bigint;
}

export interface BuyV2Summary extends TransactionSummary {
  sender: string;
  rank: bigint;
  nodeNum: bigint;
  paymentAmount: bigint;
  inviterGains: bigint;
  nodeReceiverGains: bigint;
  nextCursor?: EventId | null;
}

export * from './index';
