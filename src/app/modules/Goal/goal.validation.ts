import { z } from 'zod';

const goalValidationSchema = z.object({
  title: z.string({ required_error: 'Title is required' }),
  targetAmount: z.number({ required_error: 'Target amount is required' }),
  currentAmount: z.number().optional(),
  description: z.string().optional(),
  targetDate: z.string({ required_error: 'Target date is required' }),
  categoryId: z.string().optional(),
});

export const GoalValidations = {
  goalValidationSchema,
};
