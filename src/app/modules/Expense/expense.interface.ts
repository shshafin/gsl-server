import { Types } from 'mongoose';

export interface IExpense {
  _id?: Types.ObjectId;
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  date: Date;
  description?: string;
  type?: 'essential' | 'non-essential' | 'debt';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExpenseFilters {
  searchTerm?: string;
  accountId?: string;
  categoryId?: string;
  type?: 'essential' | 'non-essential' | 'debt';
  dateFrom?: string; // ISO date string, e.g. '2025-07-01'
  dateTo?: string;
}

export interface IExpenseQuery {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IGenericResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
}
