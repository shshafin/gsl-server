import { Schema, model } from 'mongoose';
import { IAccount } from './accounts.interface';

const accountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: 'Default Account', // Default নাম দিতে পারিস
    },
    accountType: {
      type: String,
      enum: [
        'Savings Account',
        'Chequing Account',
        'Credit Card',
        'Loan',
        'Line of Credit',
        'Mortgage Account',
        'Student Loan',
      ],
      required: true,
      default: 'Savings Account', // enum থেকে একটা default দিতে হবে
    },
    financialInstitution: {
      type: String,
      enum: [
        'American Express Credit Card',
        'Automobile',
        'Bank of Montreal (Canada)',
        'CIBC (Canadian Imperial Bank of Commerce)',
        'Investment Property',
        'Royal Bank of Canada',
        'Scotiabank (Canada)',
        'TD Canada Trust - EasyWeb',
      ],
      required: true,
      default: 'Bank of Montreal (Canada)',
    },
    initialBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    netWorth: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: 'https://i.ibb.co/JWcpKNyb/16989577.png',
    },
  },
  {
    timestamps: true,
  },
);

export const Account = model<IAccount>('Account', accountSchema);
