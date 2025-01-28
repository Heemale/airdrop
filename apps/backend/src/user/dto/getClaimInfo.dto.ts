export class GetClaimInfoDto {
  page: bigint;
  currentCursor: number;
  pageSize: bigint;
  sender: string;
}
export class UpdateClaimDto {
  address: string; // 用户地址
  amount: bigint; // 领取的空投金额
  txDigest: string; // 事务摘要
  eventSeq: string; // 事件序列号
  page: bigint;
  pageSize: bigint;
  timestamp: bigint;
}
