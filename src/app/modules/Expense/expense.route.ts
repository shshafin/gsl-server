import { Router } from 'express';
import { ExpenseController } from './expense.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/create', auth(), ExpenseController.createExpense);
router.get('/', auth(), ExpenseController.getAllExpenses);
router.get('/:id', auth(), ExpenseController.getSingleExpense);
router.patch('/:id', auth(), ExpenseController.updateExpense);
router.delete('/:id', auth(), ExpenseController.deleteExpense);

export const ExpenseRoutes = router;
