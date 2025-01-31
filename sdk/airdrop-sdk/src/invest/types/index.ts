import { TransactionSummary } from '../../types';

export interface InvestInfo {
  // 总投资金额
  total_investment: BigInt;
  // 总收益金额
  total_gains: BigInt;
  // 最新一次投资金额
  last_investment:BigInt;
  // 最近一次收益累计金额
  last_accumulated_gains: BigInt;
}
export interface UpdateInvestSummary extends TransactionSummary {
  address: string;
  amount: bigint;
  is_increse: boolean;
  total_investment: bigint;
}
