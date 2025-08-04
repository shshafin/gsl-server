/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBudget } from './budget.interface';
import { Budget } from './budget.model';

const createBudget = async (payload: IBudget, userId: string) => {
  const result = await Budget.create({ ...payload, userId });
  return result;
};

const getBudgetsByAccount = async (
  filters: { type?: string; categoryId?: string },
  options: { page?: number; limit?: number },
  userId: string,
) => {
  const { type, categoryId } = filters;
  const { page = 1, limit = 10 } = options;

  const skip = (page - 1) * limit;

  const query: any = { userId }; // Add userId to filter query
  if (type) query.type = type;
  if (categoryId) query.categoryId = categoryId;

  const budgets = await Budget.find(query)
    .populate('categoryId')
    .populate('accountId')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Budget.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: budgets,
  };
};

const getSingleBudget = async (id: string, userId: string) => {
  const budget = await Budget.findOne({ _id: id, userId })
    .populate('categoryId')
    .populate('accountId');
  return budget;
};

const updateBudget = async (
  id: string,
  payload: Partial<IBudget>,
  userId: string,
) => {
  const updated = await Budget.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
  return updated;
};

const deleteBudget = async (id: string, userId: string) => {
  const deleted = await Budget.findOneAndDelete({ _id: id, userId });
  return deleted;
};

export const BudgetService = {
  createBudget,
  getBudgetsByAccount,
  getSingleBudget,
  updateBudget,
  deleteBudget,
};
