import { TransactionSummary } from '../../types';

export interface ModifyLimitSummary extends TransactionSummary {
  address: string;
  times: bigint;
  isLimit: boolean;
}
