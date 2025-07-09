import { Schema, model } from 'mongoose';
import { IGoal } from './goal.interface';

const goalSchema = new Schema<IGoal>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    description: { type: String },
    targetDate: { type: Date, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  {
    timestamps: true,
  },
);

export const Goal = model<IGoal>('Goal', goalSchema);
