import { IBudget } from './budget.interface';
import { Budget } from './budget.model';

const createBudget = async (payload: IBudget) => {
  const result = await Budget.create(payload);
  return result;
};

const getBudgetsByUser = async (userId: string) => {
  const budgets = await Budget.find({ userId }).populate('categoryId');
  return budgets;
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
  getBudgetsByUser,
  getSingleBudget,
  updateBudget,
  deleteBudget,
};
