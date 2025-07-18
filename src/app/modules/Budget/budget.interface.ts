import { Types } from 'mongoose';

export interface IBudget {
  _id?: Types.ObjectId;
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  note?: string;
  type: 'income' | 'spending';
  recurrence: 'monthly' | 'every_few_months' | 'once';
  createdAt: Date;
  updatedAt: Date;
}
