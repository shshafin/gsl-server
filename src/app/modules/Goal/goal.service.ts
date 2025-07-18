/* eslint-disable @typescript-eslint/no-explicit-any */
import { Goal } from './goal.model';
import { IGoal, IGoalFilters } from './goal.interface';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../helpers/paginationHelper';
import { IPaginationOptions } from '../Category/category.interface';

const createGoal = async (payload: IGoal) => {
  const goal = await Goal.create(payload);
  return goal;
};

const getGoalById = async (goalId: string) => {
  const goal = await Goal.findOne({ _id: goalId });
  if (!goal) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Goal not found',
      'No goal with given ID',
    );
  }
  return goal;
};

const updateGoal = async (goalId: string, payload: Partial<IGoal>) => {
  const updatedGoal = await Goal.findOneAndUpdate({ _id: goalId }, payload, {
    new: true,
  });
  if (!updatedGoal) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Goal not found',
      'No goal with given ID',
    );
  }
  return updatedGoal;
};

const deleteGoal = async (goalId: string) => {
  const deletedGoal = await Goal.findOneAndDelete({ _id: goalId });
  if (!deletedGoal) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Goal not found',
      'No goal with given ID',
    );
  }
  return deletedGoal;
};

const getAllGoals = async (
  filters: IGoalFilters,
  paginationOptions: IPaginationOptions,
) => {
  const { searchTerm, ...filterData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({
      $or: ['title', 'description'].map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Goal.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Goal.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const GoalServices = {
  createGoal,
  getGoalById,
  updateGoal,
  deleteGoal,
  getAllGoals,
};
