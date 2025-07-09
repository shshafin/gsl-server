import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CategoryValidations } from './category.validation';
import { CategoryController } from './category.controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/create',
  auth(),
  validateRequest(CategoryValidations.createCategoryValidation),
  CategoryController.createCategory,
);

router.get('/', auth(), CategoryController.getAllCategories);

router.get('/:id', auth(), CategoryController.getSingleCategory);

router.patch(
  '/:id',
  auth(),
  validateRequest(CategoryValidations.updateCategoryValidation),
  CategoryController.updateCategory,
);

router.delete('/:id', auth(), CategoryController.deleteCategory);

export const CategoryRoutes = router;
