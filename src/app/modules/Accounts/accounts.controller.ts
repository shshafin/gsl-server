import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import {
  createAccountService,
  deleteAccountService,
  getAllAccountsService,
  getSingleAccountService,
  updateAccountService,
} from './accounts.service';
import httpStatus from 'http-status';
import sendResponse from '../../shared/sendResponse';
import { paginationFields } from '../../constants/constants';
import pick from '../../shared/pick';
import { accountFilterableFields } from './accounts.constants';

export const createAccount = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user._id;
  const account = await createAccountService(req.body, userId);
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: account,
  });
});

export const getAllAccounts = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      searchTerm: req.query.searchTerm as string | undefined,
      ...pick(req.query, accountFilterableFields),
    };

    const paginationOptions = pick(req.query, paginationFields);
    const userId = req.user._id;

    const result = await getAllAccountsService(
      filters,
      paginationOptions,
      userId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Accounts retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

export const getSingleAccount = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;
    const account = await getSingleAccountService(id, userId);
    res.status(200).json({
      success: true,
      message: 'Account retrieved successfully',
      data: account,
    });
  },
);

export const updateAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;
  const updated = await updateAccountService(id, req.body, userId);
  res.status(200).json({
    success: true,
    message: 'Account updated successfully',
    data: updated,
  });
});

export const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id;
  await deleteAccountService(id, userId);
  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
});
