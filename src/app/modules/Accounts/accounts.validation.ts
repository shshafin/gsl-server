import { z } from 'zod';

export const createAccountZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Account name is required',
    }),
    accountType: z.enum(
      [
        'Savings Account',
        'Chequing Account',
        'Credit Card',
        'Loan',
        'Line of Credit',
        'Mortgage Account',
        'Student Loan',
      ],
      {
        required_error: 'Account type is required',
      },
    ),
    financialInstitution: z.enum(
      [
        'American Express Credit Card',
        'Automobile',
        'Bank of Montreal (Canada)',
        'CIBC (Canadian Imperial Bank of Commerce)',
        'Investment Property',
        'Royal Bank of Canada',
        'Scotiabank (Canada)',
        'TD Canada Trust - EasyWeb',
      ],
      {
        required_error: 'Financial institution is required',
      },
    ),
    initialBalance: z.number({
      required_error: 'Initial balance is required',
    }),
  }),
});
