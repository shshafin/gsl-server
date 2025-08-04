import { Types } from 'mongoose';

export interface IGoal {
  userId: Types.ObjectId; // assuming goals are user-specific
  _id?: Types.ObjectId;
  accountId: Types.ObjectId;
  title: string;
  targetAmount: number;
  currentAmount?: number;
  description?: string;
  targetDate: Date;
  categoryId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGoalFilters {
  searchTerm?: string;
  title?: string;
  categoryId?: string;
  accountId?: string;
}
