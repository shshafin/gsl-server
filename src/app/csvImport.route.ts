/* eslint-disable no-console */
import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import mongoose, { Schema, Document } from 'mongoose';

const router = Router();

interface ICustomer extends Document {
  name: string;
  email: string;
  age: number;
}

const customerSchema = new Schema<ICustomer>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
});

const Customer =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>('Customer', customerSchema);

const upload = multer({ dest: 'uploads/' });

// POST - Import CSV
router.post('/import-customers', upload.single('file'), (req, res) => {
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const results: any[] = [];

  console.log('Starting to read file:', req.file.path);

  fs.createReadStream(req.file.path)
    .pipe(csv({ separator: '\t' })) // প্রয়োজনমত পরিবর্তন করবেন
    .on('data', (data) => {
      console.log('Row data:', data);
      results.push(data);
    })
    .on('end', async () => {
      console.log('Finished reading CSV. Total rows:', results.length);

      try {
        const formatted = results.map((item, idx) => {
          console.log(`Formatting row ${idx + 1}:`, item);

          const ageNum =
            item.age && !isNaN(Number(item.age)) ? Number(item.age) : 0;

          console.log(`Parsed age for row ${idx + 1}:`, ageNum);

          return {
            name: item.name,
            email: item.email,
            age: ageNum,
          };
        });

        console.log('Data ready to insert:', formatted);

        await Customer.insertMany(formatted);
        console.log('Data inserted successfully into database');

        try {
          if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
          }
          fs.unlinkSync(req.file.path);
          console.log('Uploaded file deleted:', req.file.path);
        } catch (unlinkErr) {
          console.warn('Could not delete file:', unlinkErr);
        }

        res.status(200).json({
          message: 'Customers imported successfully',
          count: formatted.length,
        });
      } catch (err: any) {
        console.error('Error importing CSV:', err);
        res.status(500).json({
          error: 'Error importing CSV',
          details: err.message,
        });
      }
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).json({
        error: 'Error reading CSV file',
        details: err.message,
      });
    });
});

// GET - Fetch all customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.status(200).json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

export default router;
