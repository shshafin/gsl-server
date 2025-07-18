import { Request, Response } from 'express';
import catchAsync from '../../shared/catchAsync';
import {
  createAccountService,
  deleteAccountService,
  getAllAccountsService,
  getSingleAccountService,
  updateAccountService,
} from './accounts.service';

export const createAccount = catchAsync(async (req: Request, res: Response) => {
  const account = await createAccountService(req.body);
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: account,
  });
});

export const getAllAccounts = catchAsync(
  async (req: Request, res: Response) => {
    const accounts = await getAllAccountsService();
    res.status(200).json({
      success: true,
      message: 'Accounts retrieved successfully',
      data: accounts,
    });
  },
);

export const getSingleAccount = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const account = await getSingleAccountService(id);
    res.status(200).json({
      success: true,
      message: 'Account retrieved successfully',
      data: account,
    });
  },
);

export const updateAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await updateAccountService(id, req.body);
  res.status(200).json({
    success: true,
    message: 'Account updated successfully',
    data: updated,
  });
});

export const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteAccountService(id);
  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
});
