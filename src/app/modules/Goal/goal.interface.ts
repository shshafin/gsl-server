import { Types } from 'mongoose';

export interface IGoal {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  targetAmount: number;
  currentAmount?: number;
  description?: string;
  targetDate: Date;
  categoryId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
