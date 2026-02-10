import { z } from 'zod';
import type { Translator } from '@/components/providers/i18n-provider';

export const createBalanceSchema = (t: Translator) =>
  z.object({
    initialBalance: z
      .number({ message: t('finance.balanceInvalid') })
      .min(0, t('finance.balanceMin')),
  });

export const createCategorySchema = (t: Translator) =>
  z.object({
    name: z.string().min(2, t('finance.categoryNameMin')),
    type: z.enum(['income', 'expense', 'both']),
    color: z.string().optional(),
  });

export const createTransactionSchema = (t: Translator) =>
  z.object({
    type: z.enum(['income', 'expense']),
    categoryId: z.string().min(1, t('finance.categoryRequired')),
    categoryName: z.string().optional(),
    amount: z
      .number({ message: t('finance.amountInvalid') })
      .positive(t('finance.amountPositive')),
    date: z.string().min(1, t('finance.dateRequired')),
    description: z.string().optional(),
  });

export type BalanceInput = z.infer<ReturnType<typeof createBalanceSchema>>;
export type CategoryInput = z.infer<ReturnType<typeof createCategorySchema>>;
export type TransactionInput = z.infer<
  ReturnType<typeof createTransactionSchema>
>;
