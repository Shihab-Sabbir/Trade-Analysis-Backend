import { z } from 'zod';

export const createBusinessHealthDataZodSchema = z.object({
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
    year: z.string({
      required_error: 'Year is required',
    }),
    month: z.string({
      required_error: 'Month is required',
    }),
    health: z.string().optional(), // Health is calculated, not required in the request body
    lastMonth: z
      .object({
        data: z
          .object({
            income: z.number().optional(),
            expenses: z.number().optional(),
            debts: z.number().optional(),
            assets: z.number().optional(),
          })
          .optional(),
      })
      .optional(),
    changesFromLastMonth: z
      .object({
        income: z.string().optional(),
        expenses: z.string().optional(),
        debts: z.string().optional(),
        assets: z.string().optional(),
        health: z.string().optional(),
      })
      .optional(),
  }),
});

export const updateBusinessHealthZodSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    data: z
      .object({
        income: z.number().optional(),
        expenses: z.number().optional(),
        debts: z.number().optional(),
        assets: z.number().optional(),
      })
      .optional(),
    year: z.string().optional(),
    month: z.string().optional(),
    health: z.string().optional(),
    lastMonth: z
      .object({
        data: z
          .object({
            income: z.number().optional(),
            expenses: z.number().optional(),
            debts: z.number().optional(),
            assets: z.number().optional(),
          })
          .optional(),
      })
      .optional(),
    changesFromLastMonth: z
      .object({
        income: z.string().optional(),
        expenses: z.string().optional(),
        debts: z.string().optional(),
        assets: z.string().optional(),
        health: z.string().optional(),
      })
      .optional(),
  }),
});

