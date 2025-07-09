import { Category } from './category.model';
import { ICategory } from './category.interface';

const createCategory = async (payload: ICategory) => {
  const category = await Category.create(payload);
  return category;
};

const getAllCategories = async () => {
  const categories = await Category.find().populate('parentCategory');
  return categories;
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
