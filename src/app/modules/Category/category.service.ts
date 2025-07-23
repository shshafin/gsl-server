import { Category } from './category.model';
import {
  ICategory,
  ICategoryFilters,
  IPaginationOptions,
} from './category.interface';
import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../helpers/paginationHelper';
import { categorySearchableFields } from './category.constants';

const createCategory = async (payload: ICategory) => {
  const category = await Category.create(payload);
  return category;
};

const getAllCategories = async (
  filters: ICategoryFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

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

const getSingleCategory = async (id: string) => {
  const category = await Category.findById(id).populate('parentCategory');
  return category;
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  const updated = await Category.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

const deleteCategory = async (id: string) => {
  const result = await Category.findByIdAndDelete(id);
  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
