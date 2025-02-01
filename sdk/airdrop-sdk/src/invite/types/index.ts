import { TransactionSummary } from '../../types';
import { EventId } from '@mysten/sui/client';

export interface BindSummary extends TransactionSummary {
  sender: string;
  inviter: string;
  nextCursor?: EventId | null;

}

export * from './index';
