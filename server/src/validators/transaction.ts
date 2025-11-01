import { z } from 'zod';

export const transactionBodySchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().finite().nonnegative(),
  description: z.string().min(1).max(500),
  category: z.string().min(1).max(100),
  date: z.coerce.date()
});

export const transactionQuerySchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
});
