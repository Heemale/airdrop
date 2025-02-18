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

export interface UserStatus {
  rank: number;
  nodeNum: number;
  isInvalid: boolean;
}
export interface BuySummary extends TransactionSummary {
  sender: string;
  rank: bigint;
  nodeNum: bigint;
}

export interface AddSummary extends TransactionSummary {
  rank: bigint;
  name: string;
  description: string;
  isOpen: boolean;
  createAt: bigint;
}

export interface BuyV2Summary extends TransactionSummary {
  sender: string;
  rank: bigint;
  nodeNum: bigint;
  timestamp: bigint;
  paymentAmount: bigint;
  inviterGains: bigint;
  nodeReceiverGains: bigint;
  nextCursor?: EventId | null;
}

export interface NodeChangeSummary extends TransactionSummary {
  rank: bigint;
  name: string;
  description: string;
  limit: bigint;
  price: bigint;
  totalQuantity: bigint;
  purchasedQuantity: bigint;
  isOpen: boolean;
  isRemove: boolean;
}

export enum NodeStatus {
  NODE_NOT_OWNED = 0,
  NODE_ACTIVE = 1,
  NODE_DISABLED = 2,
}

export * from './index';
