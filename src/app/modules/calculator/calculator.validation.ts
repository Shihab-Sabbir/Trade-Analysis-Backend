import { z } from 'zod';

export const createCalculatorZodSchema = z.object({
  body: z.object({
    data: z.object({
      income: z.number({
        required_error: 'Income is required and must be a number',
      }),
      expenses: z.number({
        required_error: 'Expenses are required and must be a number',
      }),
      debts: z.number({
        required_error: 'Debts are required and must be a number',
      }),
      assets: z.number({
        required_error: 'Assets are required and must be a number',
      }),
    }),
  }),
});
