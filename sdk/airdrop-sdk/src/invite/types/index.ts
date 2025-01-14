import { TransactionSummary } from '../../types';

export interface BindSummary extends TransactionSummary {
  sender: string;
  inviter: string;
}

export * from './index';
