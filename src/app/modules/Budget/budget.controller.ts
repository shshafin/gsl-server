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
  const { page, limit, type, categoryId } = req.query;

  const result = await BudgetService.getBudgetsByAccount(
    { type: type as string, categoryId: categoryId as string },
    {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    },
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Budgets fetched successfully',
    meta: result.meta,
    data: result.data,
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
