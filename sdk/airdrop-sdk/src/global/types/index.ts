import { TransactionSummary } from '../../types';

export interface UpdateInitializationListSummary extends TransactionSummary {
  object: string;
  isValid: boolean;
}
