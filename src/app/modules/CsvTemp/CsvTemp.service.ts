import { v4 as uuidv4 } from 'uuid';
import { CsvTemp } from './CsvTemp.model';
import { Transaction } from '../Transaction/transaction.model';
import { Category } from '../Category/category.model';
import { Account } from '../Accounts/accounts.model';

export const CsvTempService = {
  // Create CSV rows with userId
  async create(userId: string, data: Record<string, any>[]) {
    const batchId = uuidv4();
    const rows = data.map((row) => ({ batchId, userId, data: row }));
    const result = await CsvTemp.insertMany(rows);
    return { batchId, rows: result };
  },

  // Get all CSV rows for a batch for the specific user
  async getByBatchId(userId: string, batchId: string) {
    return await CsvTemp.find({ batchId, userId });
  },

  // Update a single row for the user
  async update(userId: string, id: string, newData: Record<string, any>) {
    return await CsvTemp.findOneAndUpdate(
      { _id: id, userId },
      { data: newData },
      { new: true },
    );
  },

  // Delete a single row for the user
  async delete(userId: string, id: string) {
    return await CsvTemp.findOneAndDelete({ _id: id, userId });
  },

  // Delete all rows for a batch for the user
  async deleteByBatchId(userId: string, batchId: string) {
    return await CsvTemp.deleteMany({ batchId, userId });
  },

  // Finalize batch → move to transactions and delete temp rows
  async finalizeBatch(
    userId: string,
    batchId: string,
    accountId: string,
    mapping: Record<string, string>,
  ) {
    console.log('🔥 Finalize request body mapping:', mapping);

    // 1️⃣ Fetch temp CSV data
    const tempData = await CsvTemp.find({ batchId, userId });
    if (!tempData || tempData.length === 0) throw new Error('No data found');

    // 2️⃣ Fetch account
    const account = await Account.findById(accountId);
    if (!account) throw new Error('Account not found');

    // Start runningBalance
    let runningBalance = account.currentBalance ?? account.initialBalance;

    const transactions: any[] = [];

    for (const [idx, row] of tempData.entries()) {
      const mappedRow: any = {
        userId,
        accountId,
      };

      // Loop through CSV mapping
      for (const [csvColumn, dbField] of Object.entries(mapping)) {
        const value = row.data[csvColumn];

        switch (dbField) {
          case 'categoryId': {
            if (value) {
              let category = await Category.findOne({
                name: value.trim(),
                userId,
              });
              if (!category) {
                category = await Category.create({
                  name: value.trim(),
                  userId,
                  type: 'essential',
                  isCustom: true,
                });
              }
              mappedRow.categoryId = category._id;
            } else {
              mappedRow.categoryId = null;
            }
            break;
          }
          case 'description':
            mappedRow.description = value || 'N/A';
            break;
          case 'debitAmount':
            mappedRow.debitAmount = Number(value) || 0;
            break;
          case 'creditAmount':
            mappedRow.creditAmount = Number(value) || 0;
            break;
          case 'type':
            mappedRow.type = value || 'bank';
            break;
          case 'date':
            mappedRow.date = value ? new Date(value) : new Date();
            break;
          // ignore or other fields handled automatically
        }
      }

      // ✅ Calculate balance after mapping
      mappedRow.balance =
        row.data['balance'] != null && row.data['balance'] !== ''
          ? Number(row.data['balance'])
          : runningBalance +
            (mappedRow.creditAmount || 0) -
            (mappedRow.debitAmount || 0);

      // Update runningBalance for next iteration
      runningBalance = mappedRow.balance;

      // Fallbacks
      if (!mappedRow.description) mappedRow.description = 'N/A';
      if (!mappedRow.type) mappedRow.type = 'bank';
      if (!mappedRow.date) mappedRow.date = new Date();

      console.log(`✅ Mapped row [${idx}]:`, mappedRow);
      transactions.push(mappedRow);
    }

    console.log('All mapped transactions ready for insert:', transactions);

    // 3️⃣ Insert transactions
    await Transaction.insertMany(transactions);

    // 4️⃣ Update account balances
    account.currentBalance = runningBalance;
    account.netWorth = runningBalance;
    await account.save();

    // 5️⃣ Clean up temp CSV
    await CsvTemp.deleteMany({ batchId, userId });

    return { insertedCount: transactions.length };
  },
};
