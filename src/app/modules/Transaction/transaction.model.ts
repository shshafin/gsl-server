import { Schema, model } from 'mongoose';
import { ITransaction } from './transaction.interface';

const transactionSchema = new Schema<ITransaction>(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: {
      type: String,
      default: 'N/A',
    },
    date: {
      type: Date,
      required: true,
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
      required: true,
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
