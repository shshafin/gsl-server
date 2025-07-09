import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { BudgetService } from './budget.service';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';

const createBudget = catchAsync(async (req: Request, res: Response) => {
  const result = await BudgetService.createBudget(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Budget created successfully',
    data: result,
  });
});

const getBudgets = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const result = await BudgetService.getBudgetsByUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Budgets fetched successfully',
    data: result,
  });
});

const getSingleBudget = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BudgetService.getSingleBudget(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Budget fetched successfully',
    data: result,
  });
});

const updateBudget = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BudgetService.updateBudget(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Budget updated successfully',
    data: result,
  });
});

const deleteBudget = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BudgetService.deleteBudget(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Budget deleted successfully',
    data: result,
  });
});

export const BudgetController = {
  createBudget,
  getBudgets,
  getSingleBudget,
  updateBudget,
  deleteBudget,
};
