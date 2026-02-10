export type CategoryType = 'income' | 'expense' | 'both';

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryInput {
  name: string;
  type: CategoryType;
  color?: string;
}
