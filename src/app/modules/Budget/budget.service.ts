/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBudget } from './budget.interface';
import { Budget } from './budget.model';

const createBudget = async (payload: IBudget) => {
  const result = await Budget.create(payload);
  return result;
};

const getBudgetsByAccount = async (
  filters: { type?: string; categoryId?: string },
  options: { page?: number; limit?: number },
) => {
  const { type, categoryId } = filters;
  const { page = 1, limit = 10 } = options;

  const skip = (page - 1) * limit;

  const query: any = {};
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

const getSingleBudget = async (id: string) => {
  const budget = await Budget.findById(id).populate('categoryId');
  return budget;
};

const updateBudget = async (id: string, payload: Partial<IBudget>) => {
  const updated = await Budget.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

const deleteBudget = async (id: string) => {
  const deleted = await Budget.findByIdAndDelete(id);
  return deleted;
};

export const BudgetService = {
  createBudget,
  getBudgetsByAccount,
  getSingleBudget,
  updateBudget,
  deleteBudget,
};
