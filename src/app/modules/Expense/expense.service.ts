/* eslint-disable @typescript-eslint/no-explicit-any */
import { Expense } from './expense.model';
import { IExpense, IExpenseFilters } from './expense.interface';
import { paginationHelpers } from '../../helpers/paginationHelper';
import { IPaginationOptions } from '../Category/category.interface';
import { SortOrder } from 'mongoose';

const createExpense = async (payload: IExpense): Promise<IExpense> => {
  const expense = await Expense.create(payload);
  return expense;
};

const getAllExpenses = async (
  filters: IExpenseFilters,
  options: IPaginationOptions,
) => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: ['description'].map((field) => ({
        [field]: { $regex: searchTerm, $options: 'i' },
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

  const result = await Expense.find(whereConditions)
    .populate('categoryId')
    .populate('accountId')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Expense.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleExpense = async (id: string): Promise<IExpense | null> => {
  const expense = await Expense.findById(id);
  return expense;
};

const updateExpense = async (
  id: string,
  payload: Partial<IExpense>,
): Promise<IExpense | null> => {
  const updated = await Expense.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

const deleteExpense = async (id: string): Promise<IExpense | null> => {
  const result = await Expense.findByIdAndDelete(id);
  return result;
};

export const ExpenseService = {
  createExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
};
