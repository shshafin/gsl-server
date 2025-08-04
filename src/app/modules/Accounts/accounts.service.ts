import { SortOrder } from 'mongoose';
import { paginationHelpers } from '../../helpers/paginationHelper';
import { IPaginationOptions } from '../Category/category.interface';
import { financialInstitutionImages } from './accounts.constants';
import { IAccount, IAccountFilters } from './accounts.interface';
import { Account } from './accounts.model';

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
  userId: string, // <-- add userId here
) => {
  const { searchTerm, ...filtersData } = filters;
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const andConditions: any[] = [
    { userId }, // <-- force filter by logged-in user
  ];

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
    andConditions.length > 0 ? { $and: andConditions } : { userId }; // fallback

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const result = await Account.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Account.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
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
