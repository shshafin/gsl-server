import { z } from 'zod';

export const createCategoryValidation = z.object({
  name: z.string({
    required_error: 'Category name is required',
  }),
  type: z.enum(['essential', 'non-essential', 'debt'], {
    required_error: 'Category type is required',
  }),
  icon: z.string().optional(),
  parentCategory: z.string().optional().nullable(),
  yearlyActual: z.number().optional(),
  yearlyForecast: z.number().optional(),
  fiveYearForecast: z.number().optional(),
  isCustom: z.boolean().optional(),
});

export const updateCategoryValidation = createCategoryValidation.partial();

export const CategoryValidations = {
  createCategoryValidation,
  updateCategoryValidation,
};
