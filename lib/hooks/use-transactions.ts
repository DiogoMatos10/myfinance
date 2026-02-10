'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Transaction, TransactionInput } from '@/types/transaction';
import {
  addTransaction,
  fetchTransactions,
} from '@/lib/services/transaction-service';

export const useTransactions = (userId?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setTransactions([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactions(userId);
      setTransactions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load transactions'
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const createTransaction = async (input: TransactionInput) => {
    if (!userId) {
      throw new Error('Missing user');
    }
    const created = await addTransaction(userId, input);
    setTransactions(prev => [created, ...prev]);
  };

  const summary = useMemo(() => {
    const income = transactions
      .filter(item => item.type === 'income')
      .reduce((total, item) => total + item.amount, 0);
    const expenses = transactions
      .filter(item => item.type === 'expense')
      .reduce((total, item) => total + item.amount, 0);
    const balance = income - expenses;

    const byCategory = transactions.reduce<Record<string, number>>(
      (acc, item) => {
        if (item.type === 'expense') {
          acc[item.categoryName] = (acc[item.categoryName] ?? 0) + item.amount;
        }
        return acc;
      },
      {}
    );

    return { income, expenses, balance, byCategory };
  }, [transactions]);

  return {
    transactions,
    loading,
    error,
    summary,
    reload: load,
    createTransaction,
  };
};
