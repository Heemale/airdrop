import { TransactionSummary } from '../../types';

export interface UpdateInitializationListSummary extends TransactionSummary {
  objectId: string;
  is_valid: boolean;
}
