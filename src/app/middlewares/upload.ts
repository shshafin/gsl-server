/* eslint-disable no-undef */
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// uploads ফোল্ডারের সম্পূর্ণ পাথ
const uploadPath = path.join(__dirname, '/uploads');

// ফোল্ডারটা আগে থেকে না থাকলে বানিয়ে নাও
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/vnd.ms-excel'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed!'), false);
  }
};

export const upload = multer({ storage, fileFilter });
