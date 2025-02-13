import { TransactionSummary } from '../../types';

export interface SpecialUserLimitSummary extends TransactionSummary {
  times: string;
  isLimit: boolean;
}
