import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userLoginValidations } from './auth.validation';
import { AuthControllers, getCurrentUser } from './auth.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/login',
  validateRequest(userLoginValidations.userLoginValidationSchema),
  AuthControllers.userLogin,
);

router.post(
  '/change-password',
  auth(),
  validateRequest(userLoginValidations.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

router.get('/me', auth(), getCurrentUser);

export const AuthRoutes = router;
