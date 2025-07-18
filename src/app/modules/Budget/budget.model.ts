import { Schema, model } from 'mongoose';
import { IBudget } from './budget.interface';

const budgetSchema = new Schema<IBudget>(
  {
    accountId: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    amount: { type: Number, required: true },
    note: { type: String },
    type: {
      type: String,
      enum: ['income', 'spending'],
      required: true,
    },
    recurrence: {
      type: String,
      enum: ['monthly', 'every_few_months', 'once'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Budget = model<IBudget>('Budget', budgetSchema);
