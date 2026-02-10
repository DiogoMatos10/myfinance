import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirestoreDb } from '@/lib/firebase/config';
import type { Transaction, TransactionInput } from '@/types/transaction';
import { uploadReceipt } from '@/lib/services/upload-service';

const transactionCollection = (userId: string) =>
  collection(getFirestoreDb(), 'users', userId, 'transactions');

export const fetchTransactions = async (
  userId: string
): Promise<Transaction[]> => {
  const snapshot = await getDocs(
    query(transactionCollection(userId), orderBy('date', 'desc'))
  );

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Transaction, 'id'>),
  }));
};

export const addTransaction = async (
  userId: string,
  input: TransactionInput
): Promise<Transaction> => {
  const categoryName = input.categoryName ?? '';
  const receiptUrl = input.receiptFile
    ? await uploadReceipt(userId, input.receiptFile)
    : undefined;

  const payload = {
    type: input.type,
    categoryId: input.categoryId,
    categoryName,
    amount: input.amount,
    date: input.date,
    description: input.description ?? '',
    receiptUrl: receiptUrl ?? '',
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(transactionCollection(userId), payload);

  return {
    id: docRef.id,
    ...input,
    categoryName,
    receiptUrl,
    userId,
  };
};
