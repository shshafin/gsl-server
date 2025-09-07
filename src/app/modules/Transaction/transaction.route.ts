import express from 'express';
import { TransactionController } from './transaction.controller';
import auth from '../../middlewares/auth';
// import { upload } from '../../middlewares/upload';

const router = express.Router();

router.post('/create', auth(), TransactionController.createTransaction);
router.get('/', auth(), TransactionController.getAllTransactions);
router.get('/:id', auth(), TransactionController.getSingleTransaction);
router.patch('/:id', auth(), TransactionController.updateTransaction);
router.delete('/:id', auth(), TransactionController.deleteTransaction);
// router.post(
//   '/import-csv',
//   auth(),
//   upload.single('file'),
//   TransactionController.importCSV,
// );

export const TransactionRoutes = router;
