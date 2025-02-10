import { TransactionSummary } from '../../types';
import { EventId } from '@mysten/sui/client';

export interface AirdropInfo {
  // 轮次
  round: bigint;
  // 开始时间
  startTime: bigint;
  // 结束时间
  endTime: bigint;
  // 总份数
  totalShares: bigint;
  // 已领取份数
  claimedShares: bigint;
  // 总资金
  totalBalance: bigint;
  // 是否开放
  isOpen: boolean;
  // 描述
  description: string;
  // 图片链接
  image_url: string;
  // 货币类型
  coinType: string;
  //剩余金额
  remaining_balance: bigint;
}
export interface ClaimSummary extends TransactionSummary {
  sender: string;
  round: bigint;
  coinType: string;
  amount: bigint;
  timestamp: bigint;
  nextCursor?: EventId | null;
}
export interface ChangeSummary extends TransactionSummary {
  round: bigint;
  startTime: bigint;
  endTime: bigint;
  description: string;
  isOpen: boolean;
  totalShares: bigint;
  claimedShares: bigint;
  totalBalance: bigint;
  coinType: string;
  imageUrl: string;
  remainingBalance: bigint;
  isRemove: boolean;
}
