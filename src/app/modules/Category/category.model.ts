import { Schema, model } from 'mongoose';
import { ICategory } from './category.interface';

const categorySchema = new Schema<ICategory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['essential', 'non-essential', 'debt'],
      required: true,
      default: 'essential', // ডিফল্ট দিলাম
    },
    icon: {
      type: String,
      default: '',
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    yearlyActual: {
      type: Number,
      default: 0,
    },
    yearlyForecast: {
      type: Number,
      default: 0,
    },
    fiveYearForecast: {
      type: Number,
      default: 0,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ userId: 1, name: 1 }, { unique: true });

export const Category = model<ICategory>('Category', categorySchema);
