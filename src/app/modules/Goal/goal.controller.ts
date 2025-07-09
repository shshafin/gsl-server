import { Request, Response } from 'express';
import { GoalServices } from './goal.service';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import httpStatus from 'http-status';

const createGoal = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const goal = await GoalServices.createGoal(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Goal created successfully',
    data: goal,
  });
});

const getGoalById = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const goal = await GoalServices.getGoalById(req.params.id, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: goal,
  });
});

const updateGoal = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const updatedGoal = await GoalServices.updateGoal(
    req.params.id,
    userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goal updated successfully',
    data: updatedGoal,
  });
});

const deleteGoal = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const deletedGoal = await GoalServices.deleteGoal(req.params.id, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Goal deleted successfully',
    data: deletedGoal,
  });
});

const getAllGoals = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const goals = await GoalServices.getAllGoals(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: goals,
  });
});

export const GoalControllers = {
  createGoal,
  getGoalById,
  updateGoal,
  deleteGoal,
  getAllGoals,
};
