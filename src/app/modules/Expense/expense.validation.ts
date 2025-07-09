import { z } from 'zod';

export const createExpenseZodSchema = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User ID is required' }),
    categoryId: z.string({ required_error: 'Category ID is required' }),
    amount: z
      .number({ required_error: 'Amount is required' })
      .positive('Amount must be a positive number'),
    date: z.string({ required_error: 'Date is required' }),
    description: z.string().optional(),
    type: z.enum(['essential', 'non-essential', 'debt']),
  }),
});
