import { Types } from 'mongoose';

export interface ICsvTemp {
  _id?: string;
  batchId: string;
  userId: Types.ObjectId;
  data: Record<string, any>;
}
