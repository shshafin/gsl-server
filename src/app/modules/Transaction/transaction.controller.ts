import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { TransactionService } from './transaction.service';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';

const createTransaction = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const userId = req.user._id; // Ensure userId is set from the request context
  const result = await TransactionService.createTransaction(payload, userId);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Transaction created successfully',
    data: result,
  });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const paginationOptions = req.query;

  const userId = req.user._id; // Get userId from the request context
  const result = await TransactionService.getAllTransactions(
    filters,
    paginationOptions,
    userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transactions fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id; // Get userId from the request context
  const result = await TransactionService.getSingleTransaction(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transaction fetched successfully',
    data: result,
  });
});

const updateTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;

  const userId = req.user._id; // Get userId from the request context
  const result = await TransactionService.updateTransaction(
    id,
    payload,
    userId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transaction updated successfully',
    data: result,
  });
});

const deleteTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user._id; // Get userId from the request context
  const result = await TransactionService.deleteTransaction(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transaction deleted successfully',
    data: result,
  });
});

const importCSV = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: 'CSV file is required' });
  }
  const filePath = req.file.path; // Assuming the file is uploaded and available at this path
  const userId = req.user._id; // Get userId from the request context
  await TransactionService.importTransactionsFromCSV(filePath, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transactions imported successfully',
    data: req.file,
  });
});

export const TransactionController = {
  createTransaction,
  getAllTransactions,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
  importCSV,
};
