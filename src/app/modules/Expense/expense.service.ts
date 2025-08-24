/* eslint-disable @typescript-eslint/no-explicit-any */
import { Expense } from './expense.model';
import { IExpense, IExpenseFilters } from './expense.interface';
import { paginationHelpers } from '../../helpers/paginationHelper';
import { IPaginationOptions } from '../Category/category.interface';
import { SortOrder } from 'mongoose';
import { Account } from '../Accounts/accounts.model';

const createExpense = async (
  payload: IExpense,
  userId: string,
): Promise<IExpense> => {
  const expense = await Expense.create({ ...payload, userId });
  return expense;
};

const getAllExpenses = async (
  filters: IExpenseFilters,
  options: IPaginationOptions,
  userId: string,
) => {
  const { searchTerm, dateFrom, dateTo, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(options);

  const andConditions: any[] = [];

  // userId filter (সবসময় লাগে)
  andConditions.push({ userId });

  // 🔎 Search term filter (account.name দিয়ে search)
  if (searchTerm) {
    const accounts = await Account.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).select('_id');

    const accountIds = accounts.map((acc) => acc._id);

    if (accountIds.length > 0) {
      andConditions.push({ accountId: { $in: accountIds } });
    } else {
      // কোনো ম্যাচ না হলে খালি result
      andConditions.push({ accountId: { $in: [] } });
    }
  }

  // 📅 Date range filter
  if (dateFrom || dateTo) {
    const dateFilter: any = {};

    if (dateFrom) {
      const fromDate = new Date(dateFrom.toString().trim());
      if (!isNaN(fromDate.getTime())) {
        dateFilter.$gte = fromDate;
      }
    }

    if (dateTo) {
      const toDate = new Date(dateTo.toString().trim());
      if (!isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999);
        dateFilter.$lte = toDate;
      }
    }

    if (Object.keys(dateFilter).length > 0) {
      andConditions.push({ date: dateFilter });
    }
  }

  // অন্যান্য filter (accountId, categoryId, type)
  for (const [field, value] of Object.entries(filtersData)) {
    if (value) {
      andConditions.push({ [field]: value });
    }
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // sort
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // query চালানো
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

const getSingleExpense = async (
  id: string,
  userId: string,
): Promise<IExpense | null> => {
  const expense = await Expense.findOne({ _id: id, userId })
    .populate('categoryId')
    .populate('accountId');
  return expense;
};

const updateExpense = async (
  id: string,
  payload: Partial<IExpense>,
  userId: string,
): Promise<IExpense | null> => {
  const updated = await Expense.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
  return updated;
};

const deleteExpense = async (
  id: string,
  userId: string,
): Promise<IExpense | null> => {
  const result = await Expense.findOneAndDelete({ _id: id, userId });
  return result;
};

export const ExpenseService = {
  createExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
};
