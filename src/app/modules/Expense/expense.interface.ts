import { Types } from 'mongoose';

export interface IExpense {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  categoryId: Types.ObjectId;
  amount: number;
  date: Date;
  description?: string;
  type?: 'essential' | 'non-essential' | 'debt';
  createdAt?: Date;
  updatedAt?: Date;
}
