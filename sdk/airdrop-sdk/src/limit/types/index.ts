import { TransactionSummary } from '../../types';

export interface SpecialUserLimitSummary extends TransactionSummary {
  times: bigint;
  isLimit: boolean;
}
