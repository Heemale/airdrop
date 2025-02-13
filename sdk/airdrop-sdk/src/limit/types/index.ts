import { TransactionSummary } from '../../types';

export interface SpecialUserLimitSummary extends TransactionSummary {
  times: string;
  is_limit: boolean;
}
