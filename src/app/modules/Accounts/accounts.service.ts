import { financialInstitutionImages } from './accounts.constants';
import { IAccount } from './accounts.interface';
import { Account } from './accounts.model';

export const createAccountService = async (payload: IAccount) => {
  if (!payload.imageUrl) {
    payload.imageUrl =
      financialInstitutionImages[payload.financialInstitution] ||
      'https://i.ibb.co/JWcpKNyb/16989577.png';
  }

  const createdAccount = await Account.create(payload);
  return createdAccount;
};

export const getAllAccountsService = async () => {
  return await Account.find();
};

export const getSingleAccountService = async (id: string) => {
  return await Account.findById(id);
};

export const deleteAccountService = async (id: string) => {
  return await Account.findByIdAndDelete(id);
};

export const updateAccountService = async (
  id: string,
  payload: Partial<IAccount>,
) => {
  return await Account.findByIdAndUpdate(id, payload, { new: true });
};
