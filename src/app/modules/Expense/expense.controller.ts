import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { ExpenseService } from './expense.service';
import { expenseFilterableFields } from './expense.constants';
import { paginationFields } from '../../constants/constants';
import pick from '../../shared/pick';

const createExpense = catchAsync(async (req: Request, res: Response) => {
  const result = await ExpenseService.createExpense(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense created successfully',
    data: result,
  });
});

const getAllExpenses = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, expenseFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const userId = req.user._id;

  const result = await ExpenseService.getAllExpenses(
    userId,
    filters,
    paginationOptions,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expenses fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleExpense = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ExpenseService.getSingleExpense(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense fetched successfully',
    data: result,
  });
});

const updateExpense = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ExpenseService.updateExpense(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense updated successfully',
    data: result,
  });
});

const deleteExpense = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ExpenseService.deleteExpense(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense deleted successfully',
    data: result,
  });
});

export const ExpenseController = {
  createExpense,
  getAllExpenses,
  getSingleExpense,
  updateExpense,
  deleteExpense,
};
