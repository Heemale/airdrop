import { TransactionSummary } from '../../types';

export interface UpdateInitializationListSummary extends TransactionSummary {
  object: string;
  is_valid: boolean;
}
