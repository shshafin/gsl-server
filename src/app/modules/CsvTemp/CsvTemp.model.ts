import { Schema, model } from 'mongoose';
import { ICsvTemp } from './CsvTemp.interface';

const csvTempSchema = new Schema<ICsvTemp>(
  {
    batchId: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: Object, required: true },
  },
  { timestamps: true },
);

export const CsvTemp = model<ICsvTemp>('CsvTemp', csvTempSchema);
