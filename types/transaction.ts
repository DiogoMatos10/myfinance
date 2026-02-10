export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  amount: number;
  date: string;
  description?: string;
  receiptUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionInput {
  type: TransactionType;
  categoryId: string;
  categoryName?: string;
  amount: number;
  date: string;
  description?: string;
  receiptFile?: File | null;
}
