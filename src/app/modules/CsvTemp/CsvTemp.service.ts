import { v4 as uuidv4 } from 'uuid';
import { CsvTemp } from './CsvTemp.model';
import { Transaction } from '../Transaction/transaction.model';

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
  async finalizeBatch(userId: string, batchId: string, accountId: string) {
    // 1️⃣ get all temp rows for this user & batch
    const tempData = await CsvTemp.find({ batchId, userId });
    if (!tempData || tempData.length === 0) throw new Error('No data found');

    // 2️⃣ map CSV rows to Transaction documents
    const transactions = tempData.map((row) => ({
      userId,
      accountId,
      categoryId: row.data['categoryId'] || null,
      description: row.data['description'] || 'N/A',
      debitAmount: Number(row.data['debitAmount']) || 0,
      creditAmount: Number(row.data['creditAmount']) || 0,
      balance: Number(row.data['balance']) || 0,
      type: row.data['type'] || 'bank',
      date: row.data['date'] ? new Date(row.data['date']) : new Date(),
    }));

    // 3️⃣ insert into transactions
    await Transaction.insertMany(transactions);

    // 4️⃣ delete temp rows
    await CsvTemp.deleteMany({ batchId, userId });

    return { insertedCount: transactions.length };
  },
};
