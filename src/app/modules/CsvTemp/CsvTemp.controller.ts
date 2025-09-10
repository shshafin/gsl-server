import { Request, Response } from 'express';
import { CsvTempService } from './CsvTemp.service';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';

export const CsvTempController = {
  // Upload CSV file
  async upload(req: Request, res: Response) {
    try {
      const userId = req.user._id;

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: 'CSV file is required' });
      }

      const filePath = path.join(req.file.path);
      const rows: Record<string, any>[] = [];

      // Parse CSV
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => rows.push(row))
        .on('end', async () => {
          // Save parsed rows via service
          const result = await CsvTempService.create(userId, rows);

          // Delete uploaded CSV file after processing
          fs.unlinkSync(filePath);

          res.status(201).json({ success: true, ...result });
        })
        .on('error', (err) => {
          res.status(500).json({ success: false, message: err.message });
        });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Get CSV rows by batchId
  async getByBatchId(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const { batchId } = req.params;
      const result = await CsvTempService.getByBatchId(userId, batchId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Update single row
  async update(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const { data } = req.body;
      const result = await CsvTempService.update(userId, id, data);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Delete single row
  async delete(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      await CsvTempService.delete(userId, id);
      res.json({ success: true, message: 'Deleted' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // Finalize batch → insert into transactions
  // controller
  async finalize(req: Request, res: Response) {
    console.log('🔥 Finalize request body:', JSON.stringify(req.body, null, 2));

    try {
      const userId = req.user._id;
      const { batchId, accountId, mapping } = req.body;

      // sanity check
      if (!batchId || !accountId || !mapping) {
        console.error('❌ Missing fields:', { batchId, accountId, mapping });
      }

      const result = await CsvTempService.finalizeBatch(
        userId,
        batchId,
        accountId,
        mapping,
      );

      res.json({ success: true, message: 'Transactions created', ...result });
    } catch (err: any) {
      console.error('❌ Finalize error:', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
