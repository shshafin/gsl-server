import { z } from 'zod';

export const transactionZodSchema = z.object({
  body: z.object({
    accountId: z.string().nonempty('Account ID is required'),
    categoryId: z.string().nonempty('Category ID is required'),
    description: z.string().optional().default('N/A'),
    date: z
      .string()
      .nonempty('Date is required')
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format',
      }),
    debitAmount: z.number().optional().default(0),

    creditAmount: z.number().optional().default(0),

    balance: z.number().optional().default(0),

    type: z.enum(['cash', 'bank'], {
      required_error: 'Transaction type is required',
    }),
  }),
});
