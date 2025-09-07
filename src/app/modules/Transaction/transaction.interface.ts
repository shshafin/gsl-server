import { Types } from 'mongoose';

export interface ITransaction {
  userId?: Types.ObjectId; // User who owns the transaction
  accountId?: Types.ObjectId | string; // Account linked to transaction
  categoryId?: Types.ObjectId | string; // Category of the transaction
  description?: string; // Optional description/details
  date?: Date; // Transaction date
  debitAmount?: number; // Amount debited (optional, one of debit/credit)
  creditAmount?: number; // Amount credited (optional)
  balance?: number; // Balance after this transaction (optional)
  type?: 'cash' | 'bank'; // Transaction type to clarify debit or credit
}
