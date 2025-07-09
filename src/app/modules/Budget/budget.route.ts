import express from 'express';
import { BudgetController } from './budget.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create', auth(), BudgetController.createBudget);
router.get('/', auth(), BudgetController.getBudgets);
router.get('/:id', auth(), BudgetController.getSingleBudget);
router.patch('/:id', auth(), BudgetController.updateBudget);
router.delete('/:id', auth(), BudgetController.deleteBudget);

export const BudgetRoutes = router;
