import { Category } from './category.model';
import {
  ICategory,
  ICategoryFilters,
  IPaginationOptions,
} from './category.interface';
import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../helpers/paginationHelper';
import { categorySearchableFields } from './category.constants';

const createCategory = async (payload: ICategory, userId: string) => {
  const category = await Category.create({ ...payload, userId });
  return category;
};

const getAllCategories = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOptions,
  userId: string,
) => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: any[] = [];

  // Add userId filter here
  andConditions.push({ userId });

  if (searchTerm && searchTerm.trim() !== '') {
    andConditions.push({
      $or: categorySearchableFields.map((field) => ({
        [field]: { $regex: searchTerm.trim(), $options: 'i' },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Category.find(whereConditions)
    .populate('parentCategory')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Category.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleCategory = async (id: string, userId: string) => {
  const category = await Category.findOne({ _id: id, userId }).populate(
    'parentCategory',
  );
  return category;
};

const updateCategory = async (
  id: string,
  payload: Partial<ICategory>,
  userId: string,
) => {
  const updated = await Category.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true },
  );
  return updated;
};

const deleteCategory = async (id: string, userId: string) => {
  const result = await Category.findOneAndDelete({ _id: id, userId });
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
