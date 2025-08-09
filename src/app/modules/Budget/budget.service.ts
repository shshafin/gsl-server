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

  const query: any = { userId };
  if (type) query.type = type;
  if (categoryId) query.categoryId = categoryId;

  // Step 1: Fetch budgets with pagination & populate
  const budgets = await Budget.find(query)
    .populate('categoryId')
    .populate('accountId')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Budget.countDocuments(query);

  // Step 2: Fetch all budgets WITHOUT pagination but WITH same filters and userId,
  // to calculate remainingBudget correctly on the full data set
  const allBudgets = await Budget.find({
    userId,
    ...(type && { type }),
    ...(categoryId && { categoryId }),
  });

  // Step 3: Group by category + recurrence and sum income & spending
  const grouped: Record<string, { income: number; spending: number }> = {};

  allBudgets.forEach((item) => {
    const key = `${item.categoryId.toString()}_${item.recurrence}`;
    if (!grouped[key]) grouped[key] = { income: 0, spending: 0 };

    if (item.type.toLowerCase() === 'income')
      grouped[key].income += item.amount;
    else if (item.type.toLowerCase() === 'spending')
      grouped[key].spending += item.amount;
  });

  // Step 4: Map over paginated budgets and attach remainingBudget
  const budgetsWithRemaining = budgets.map((item) => {
    const key = `${item.categoryId._id.toString()}_${item.recurrence}`;
    const group = grouped[key] || { income: 0, spending: 0 };
    const remainingBudget = group.income - group.spending;

    return {
      ...item.toObject(),
      remainingBudget,
    };
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: budgetsWithRemaining,
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
