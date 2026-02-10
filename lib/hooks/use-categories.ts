'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Category, CategoryInput } from '@/types/category';
import { addCategory, fetchCategories } from '@/lib/services/category-service';

export const useCategories = (userId?: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setCategories([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCategories(userId);
      setCategories(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load categories'
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const createCategory = async (input: CategoryInput) => {
    if (!userId) {
      throw new Error('Missing user');
    }
    const created = await addCategory(userId, input);
    setCategories(prev => [created, ...prev]);
  };

  return {
    categories,
    loading,
    error,
    reload: load,
    createCategory,
  };
};
