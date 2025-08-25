/* eslint-disable no-console */
import { ITransaction } from './transaction.interface';
import { FilterQuery, SortOrder } from 'mongoose';
import { Transaction } from './transaction.model';
import fs from 'fs';
import csvParser from 'csv-parser';
import { Account } from '../Accounts/accounts.model';
import { Category } from '../Category/category.model';

interface IFilters {
  accountId?: string;
  categoryId?: string;
  searchTerm?: string; // for description search
  fromDate?: string;
  toDate?: string;
  type?: 'cash' | 'bank';
}

interface IPaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

interface IGenericResponse<T> {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
}

const calculatePagination = (options: IPaginationOptions) => {
  const page = Number(options.page) || 1;
  const limit = Number(options.limit ?? 10);
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy || 'date';
  const sortOrder = options.sortOrder || 'desc';
  return { page, limit, skip, sortBy, sortOrder };
};

const createTransaction = async (
  payload: ITransaction,
  userId: string,
): Promise<ITransaction> => {
  const transaction = await Transaction.create({ ...payload, userId });
  return transaction;
};

const getAllTransactions = async (
  filters: IFilters,
  options: IPaginationOptions,
  userId: string,
): Promise<IGenericResponse<ITransaction[]>> => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const andConditions: FilterQuery<ITransaction>[] = [];

  // Always filter by userId
  andConditions.push({ userId });

  // Filtering by accountId, categoryId, type
  if (filters.accountId) {
    andConditions.push({ accountId: filters.accountId });
  }
  if (filters.categoryId) {
    andConditions.push({ categoryId: filters.categoryId });
  }
  if (filters.type) {
    andConditions.push({ type: filters.type });
  }

  // Search description
  if (filters.searchTerm) {
    andConditions.push({
      description: { $regex: filters.searchTerm, $options: 'i' },
    });
  }

  // Date range filtering
  if (filters.fromDate || filters.toDate) {
    const dateFilter: any = {};
    if (filters.fromDate) {
      dateFilter.$gte = new Date(filters.fromDate);
    }
    if (filters.toDate) {
      dateFilter.$lte = new Date(filters.toDate);
    }
    andConditions.push({ date: dateFilter });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const total = await Transaction.countDocuments(whereConditions);

  const result = await Transaction.find(whereConditions)
    .populate('accountId')
    .populate('categoryId')
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleTransaction = async (
  id: string,
  userId: string,
): Promise<ITransaction | null> => {
  const transaction = await Transaction.findOne({ _id: id, userId }).populate(
    'accountId categoryId',
  );
  return transaction;
};

const updateTransaction = async (
  id: string,
  payload: Partial<ITransaction>,
  userId: string,
): Promise<ITransaction | null> => {
  const updated = await Transaction.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true },
  );
  return updated;
};

const deleteTransaction = async (
  id: string,
  userId: string,
): Promise<ITransaction | null> => {
  const deleted = await Transaction.findOneAndDelete({ _id: id, userId });
  return deleted;
};

import { Types } from 'mongoose';

const importTransactionsFromCSV = async (
  filePath: string,
  userId: string,
): Promise<void> => {
  const rows: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', async () => {
        const transactions: ITransaction[] = [];

        for (const row of rows) {
          try {
            // ✅ Handle missing account
            let account = await Account.findOne({
              name: row.accountName || 'Default Account',
              userId,
            });
            if (!account) {
              account = await Account.create({
                name: row.accountName || 'Default Account',
                userId,
                type: 'cash', // default type
                balance: 0, // default balance
              });
            }

            // ✅ Handle missing category
            let category = await Category.findOne({
              name: row.categoryName || 'Default Category',
              userId,
            });
            if (!category) {
              category = await Category.create({
                name: row.categoryName || 'Default Category',
                userId,
                type: 'essential', // default type
                isCustom: true,
              });
            }

            // ✅ Create transaction with safe defaults
            const transaction: ITransaction = {
              userId: new Types.ObjectId(userId),
              accountId: account._id,
              categoryId: category._id,
              description: row.description?.trim() || 'N/A',
              date: row.date ? new Date(row.date) : new Date(),
              debitAmount: parseFloat(row.debitAmount) || 0,
              creditAmount: parseFloat(row.creditAmount) || 0,
              balance: parseFloat(row.balance) || 0,
              type:
                row.type === 'cash' || row.type === 'bank' ? row.type : 'cash',
            };

            transactions.push(transaction);
          } catch (error) {
            console.error('Error processing row:', error);
          }
        }

        if (transactions.length === 0) {
          return reject(new Error('No valid transactions found to import.'));
        }

        try {
          await Transaction.insertMany(transactions);
          resolve();
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

export const TransactionService = {
  createTransaction,
  getAllTransactions,
  getSingleTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactionsFromCSV,
};
