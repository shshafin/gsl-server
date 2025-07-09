import { z } from 'zod';

export const budgetValidationSchema = z.object({
  categoryId: z.string({
    required_error: 'Category ID is required',
  }),
  amount: z
    .number({
      required_error: 'Amount is required',
    })
    .positive('Amount must be a positive number'),
  note: z.string().optional(),
  budgetType: z.enum(['income', 'spending'], {
    required_error: 'Budget type is required',
  }),
  whenWillThisHappen: z.enum(['every month', 'every few months', 'once'], {
    required_error: 'Please specify when this budget will happen',
  }),
});

export const budgetValidations = {
  budgetValidationSchema,
};
