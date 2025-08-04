import { Types } from 'mongoose';

export type AccountType =
  | 'Savings Account'
  | 'Chequing Account'
  | 'Credit Card'
  | 'Loan'
  | 'Line of Credit'
  | 'Mortgage Account'
  | 'Student Loan';

export type FinancialInstitution =
  | 'American Express Credit Card'
  | 'Automobile'
  | 'Bank of Montreal (Canada)'
  | 'CIBC (Canadian Imperial Bank of Commerce)'
  | 'Investment Property'
  | 'Royal Bank of Canada'
  | 'Scotiabank (Canada)'
  | 'TD Canada Trust - EasyWeb';

export interface IAccount {
  userId: Types.ObjectId; // assuming accounts are user-specific
  _id?: string;
  name: string;
  accountType: AccountType;
  financialInstitution: FinancialInstitution;
  initialBalance: number;
  imageUrl?: string; // Auto assigned based on institution
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAccountFilters {
  searchTerm?: string;
  accountType?: AccountType;
  financialInstitution?: FinancialInstitution;
}
