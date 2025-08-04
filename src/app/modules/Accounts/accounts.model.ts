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
    },
    initialBalance: {
      type: Number,
      required: true,
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
