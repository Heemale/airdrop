import { TransactionSummary } from '../../types';

export interface UpdateInitializationSummary extends TransactionSummary {
  object: string;
  is_valid: boolean;
}
