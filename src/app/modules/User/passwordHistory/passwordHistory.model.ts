import { Schema, model } from 'mongoose';
import { TPasswordHistory } from './passwordHistory.interface';

const passwordHistorySchema = new Schema<TPasswordHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    passwordHistory: { type: [String] },
  },
  {
    _id: false,
  },
);

export const PasswordHistory = model<TPasswordHistory>(
  'PasswordHistory',
  passwordHistorySchema,
);
