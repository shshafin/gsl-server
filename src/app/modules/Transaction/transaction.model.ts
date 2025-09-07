import { Schema, model } from 'mongoose';
import { ITransaction } from './transaction.interface';

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    description: {
      type: String,
      default: 'N/A', // already good
    },
    date: {
      type: Date,
      default: Date.now, // ✅ default current date
    },
    debitAmount: {
      type: Number,
      default: 0,
    },
    creditAmount: {
      type: Number,
      default: 0,
    },
    balance: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ['cash', 'bank'],
      default: 'cash', // ✅ default type
    },
  },
  {
    timestamps: true,
  },
);

export const Transaction = model<ITransaction>(
  'Transaction',
  transactionSchema,
);
