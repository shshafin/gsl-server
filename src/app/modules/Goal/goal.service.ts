/* eslint-disable @typescript-eslint/no-explicit-any */
import { Goal } from './goal.model';
import { IGoal, IGoalFilters } from './goal.interface';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../helpers/paginationHelper';
import { IPaginationOptions } from '../Category/category.interface';

const createGoal = async (payload: IGoal, userId: string) => {
  const goal = await Goal.create({ ...payload, userId });
  return goal;
};

const getGoalById = async (goalId: string, userId: string) => {
  const goal = await Goal.findOne({ _id: goalId, userId })
    .populate('categoryId')
    .populate('accountId');
  if (!goal) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Goal not found',
      'No goal with given ID for this user',
    );
  }
  return goal;
};

const updateGoal = async (
  goalId: string,
  payload: Partial<IGoal>,
  userId: string,
) => {
  const updatedGoal = await Goal.findOneAndUpdate(
    { _id: goalId, userId },
    payload,
    {
      new: true,
    },
  );
  if (!updatedGoal) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Goal not found',
      'No goal with given ID for this user',
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
      'No goal with given ID for this user',
    );
  }
  return deletedGoal;
};

const getAllGoals = async (
  filters: IGoalFilters,
  paginationOptions: IPaginationOptions,
  userId: string,
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

  // add userId condition
  andConditions.push({ userId });

  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Goal.find(whereConditions)
    .populate('categoryId')
    .populate('accountId')
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
