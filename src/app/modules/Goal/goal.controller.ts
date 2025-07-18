import { Request, Response } from 'express';
import { GoalServices } from './goal.service';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../shared/pick';
import { goalFilterableFields } from './goal.constant';
import { paginationFields } from '../Expense/expense.constants';

const createGoal = catchAsync(async (req: Request, res: Response) => {
  const goal = await GoalServices.createGoal(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Goal created successfully',
    data: goal,
  });
});

const getGoalById = catchAsync(async (req: Request, res: Response) => {
  const goal = await GoalServices.getGoalById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: goal,
  });
});

const updateGoal = catchAsync(async (req: Request, res: Response) => {
  const updatedGoal = await GoalServices.updateGoal(req.params.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goal updated successfully',
    data: updatedGoal,
  });
});

const deleteGoal = catchAsync(async (req: Request, res: Response) => {
  const deletedGoal = await GoalServices.deleteGoal(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goal deleted successfully',
    data: deletedGoal,
  });
});

const getAllGoals = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, goalFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await GoalServices.getAllGoals(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goals fetched successfully!',
    meta: result.meta,
    data: result.data,
  });
});

export const GoalControllers = {
  createGoal,
  getGoalById,
  updateGoal,
  deleteGoal,
  getAllGoals,
};
