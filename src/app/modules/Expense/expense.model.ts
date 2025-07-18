import { Schema, model } from 'mongoose';
import { IExpense } from './expense.interface';

const expenseSchema = new Schema<IExpense>(
  {
    accountId: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ['essential', 'non-essential', 'debt'],
    },
  },
  {
    timestamps: true,
  },
);

export const Expense = model<IExpense>('Expense', expenseSchema);
