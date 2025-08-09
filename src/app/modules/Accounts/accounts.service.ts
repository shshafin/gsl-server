import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../helpers/paginationHelper';
import { IPaginationOptions } from '../Category/category.interface';
import { financialInstitutionImages } from './accounts.constants';
import { IAccount, IAccountFilters } from './accounts.interface';
import { Account } from './accounts.model';
import { Transaction } from '../Transaction/transaction.model';

export const createAccountService = async (
  payload: IAccount,
  userId: string,
) => {
  if (!payload.imageUrl) {
    payload.imageUrl =
      financialInstitutionImages[payload.financialInstitution] ||
      'https://i.ibb.co/JWcpKNyb/16989577.png';
  }

  const createdAccount = await Account.create({ ...payload, userId });
  return createdAccount;
};

const accountSearchableFields = ['name', 'accountType', 'financialInstitution'];

export const getAllAccountsService = async (
  filters: IAccountFilters,
  paginationOptions: IPaginationOptions,
  userId: string,
) => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: any[] = [{ userId }];

  if (searchTerm && searchTerm.trim() !== '') {
    andConditions.push({
      $or: accountSearchableFields.map((field) => ({
        [field]: { $regex: searchTerm.trim(), $options: 'i' },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : { userId };

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  // Step 1: Fetch paginated accounts
  const accounts = await Account.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .lean(); // lean করলে plain object দিবে, manipulation সহজ হয়

  const total = await Account.countDocuments(whereConditions);

  // Step 2: Fetch transactions grouped by account for fetched accounts only
  const accountIds = accounts.map((acc) => acc._id);

  const transactionsGrouped = await Transaction.aggregate([
    { $match: { accountId: { $in: accountIds } } },
    {
      $group: {
        _id: '$accountId',
        totalCredit: { $sum: '$creditAmount' },
        totalDebit: { $sum: '$debitAmount' },
      },
    },
  ]);

  // Step 3: Map grouped transactions for quick lookup
  const transactionsMap = transactionsGrouped.reduce(
    (acc, curr) => {
      acc[curr._id.toString()] = curr;
      return acc;
    },
    {} as Record<string, { totalCredit: number; totalDebit: number }>,
  );

  // Step 4: Attach netWorth to each account
  const accountsWithNetWorth = accounts.map((account) => {
    const txns = transactionsMap[account._id.toString()] || {
      totalCredit: 0,
      totalDebit: 0,
    };
    const netWorth =
      account.initialBalance + txns.totalCredit - txns.totalDebit;
    return {
      ...account,
      netWorth,
    };
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: accountsWithNetWorth,
  };
};

export const getSingleAccountService = async (id: string, userId: string) => {
  return await Account.findOne({ _id: id, userId });
};

export const deleteAccountService = async (id: string, userId: string) => {
  return await Account.findOneAndDelete({ _id: id, userId });
};

export const updateAccountService = async (
  id: string,
  payload: Partial<IAccount>,
  userId: string,
) => {
  if (payload.financialInstitution) {
    payload.imageUrl =
      financialInstitutionImages[payload.financialInstitution] ||
      'https://i.ibb.co/JWcpKNyb/16989577.png';
  }

  return await Account.findOneAndUpdate({ _id: id, userId }, payload, {
    new: true,
  });
};
