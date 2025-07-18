import express from 'express';
import auth from '../../middlewares/auth';
import {
  createAccount,
  deleteAccount,
  getAllAccounts,
  getSingleAccount,
  updateAccount,
} from './accounts.controller';

const router = express.Router();

router.post('/create', auth(), createAccount);
router.get('/', auth(), getAllAccounts);
router.get('/:id', auth(), getSingleAccount);
router.patch('/:id', auth(), updateAccount);
router.delete('/:id', auth(), deleteAccount);

export const AccountRoutes = router;
