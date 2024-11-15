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
  // 货币类型
  coinType: string;
}
