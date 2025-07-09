import { Goal } from './goal.model';
import { IGoal } from './goal.interface';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';

const createGoal = async (userId: string, payload: IGoal) => {
  const goal = await Goal.create({ ...payload, userId });
  return goal;
};

const getGoalById = async (goalId: string, userId: string) => {
  const goal = await Goal.findOne({ _id: goalId, userId });
  if (!goal) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Goal not found',
      'No goal with given ID',
    );
  }
  return goal;
};

const updateGoal = async (
  goalId: string,
  userId: string,
  payload: Partial<IGoal>,
) => {
  const updatedGoal = await Goal.findOneAndUpdate(
    { _id: goalId, userId },
    payload,
    { new: true },
  );
  if (!updatedGoal) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Goal not found',
      'No goal with given ID',
    );
  }
  return updatedGoal;
};

const deleteGoal = async (goalId: string, userId: string) => {
  const deletedGoal = await Goal.findOneAndDelete({ _id: goalId, userId });
  if (!deletedGoal) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Goal not found',
      'No goal with given ID',
    );
  }
  return deletedGoal;
};

const getAllGoals = async (userId: string) => {
  return await Goal.find({ userId });
};

export const GoalServices = {
  createGoal,
  getGoalById,
  updateGoal,
  deleteGoal,
  getAllGoals,
};
