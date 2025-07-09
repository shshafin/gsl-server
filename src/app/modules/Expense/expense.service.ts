import { Expense } from './expense.model';
import { IExpense } from './expense.interface';

const createExpense = async (payload: IExpense): Promise<IExpense> => {
  const expense = await Expense.create(payload);
  return expense;
};

const getAllExpenses = async (userId: string): Promise<IExpense[]> => {
  const expenses = await Expense.find({ userId });
  return expenses;
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
